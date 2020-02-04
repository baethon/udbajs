const os = require('os')
const globby = require('globby')
const path = require('path')
const pAll = require('p-all')

const getPriority = filePath => {
  const name = path.basename(filePath)
  const parts = name.split('-')

  return parseInt(parts.shift(), 10) || 99
}

const groupByPriority = (carry, { priority, provider }) => ({
  ...carry,
  [priority]: (carry[priority] || []).concat(provider)
})

class Bootstrap {
  /**
   * @param {String} providersDir
   * @param {Object} options
   * @param {Number} [options.concurrency]
   */
  constructor (providersDir, options = {}) {
    const { concurrency = os.cpus().length } = options

    this._providersDir = providersDir
    this._concurrency = concurrency
    this._providers = {}
  }

  async setup () {
    this._providers = await this._loadProviders()

    await this._runMethod(this._sortedProviders, 'setup')
  }

  async shutdown () {
    await this._runMethod(this._sortedProviders.reverse(), 'shutdown')
  }

  /**
   * Get list of providers sorted by their priority
   *
   * @return {Array<Provider[]>}
   * @private
   */
  get _sortedProviders () {
    return Object.keys(this._providers)
      .sort()
      .map(priority => this._providers[priority])
  }

  /**
   * Load provider modules
   *
   * @return {Promise<Object>} list of providers grouped by their priority
   * @private
   */
  async _loadProviders () {
    const files = await globby(
      path.join(this._providersDir, '*.js'),
      { concurrency: this._concurrency }
    )
    const providers = files.map(path => {
      const Provider = require(path)

      return {
        priority: getPriority(path),
        provider: new Provider()
      }
    })

    return providers.reduce(groupByPriority, {})
  }

  /**
   * Run given method on providers respecting their priority
   *
   * @param {Array<Provider[]>} providers
   * @param {String} method
   * @return {Promise<void>}
   * @private
   */
  async _runMethod (providers, method) {
    // make sure that the providers are executed serially by their priority
    // the inner list of providers can be executed concurrently
    await pAll(
      providers.map(list => () => pAll(
        list.map(
          provider => () => {
            if (provider[method]) {
              return provider[method]()
            }
          }
        ),
        { concurrency: this._concurrency }
      )),
      { concurrency: 1 }
    )
  }
}

module.exports = Bootstrap
