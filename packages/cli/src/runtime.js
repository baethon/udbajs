const globby = require('globby')
const yargs = require('yargs')
const debug = require('debug')
const BaseCommand = require('./command')
const factory = require('./command-factory')

const cliDebug = debug('udba:cli')
const isCommand = Command => Command.prototype instanceof BaseCommand

class Runtime {
  constructor () {
    this._yargs = yargs()
      .strict()
  }

  add (Command) {
    if (!isCommand(Command)) {
      throw new Error('Provided command does not extend base command')
    }

    cliDebug(`Adding command: ${Command.name}`)
    factory(this._yargs, new Command())
  }

  /**
   * @param {String|String[]} pattern
   * @param {Object} [options] globby options
   * @return {Promise<void>}
   */
  async load (pattern, options = {}) {
    const paths = await globby(pattern, options)

    cliDebug('Attempting to load following files:', paths)

    paths.map(path => require(path))
      .filter(isCommand)
      .forEach(Command => {
        this.add(Command)
      })
  }

  /**
   * Call command using given parameters.
   *
   * Alias for: run()
   *
   * @param {String|String[]} parameters
   * @return {Promise<void>}
   */
  async call (parameters) {
    return this.run(parameters)
  }

  /**
   * Run yargs with given parameters.
   *
   * @param {String|String[]} parameters
   * @return {Promise<void>}
   */
  async run (parameters) {
    cliDebug('Running yargs with following parameters:', parameters)

    const argv = this._yargs.demandCommand()
      .parse(parameters)

    await argv._promise

    return this
  }

  exit (code = 0) {
    cliDebug(`Terminating CLI app with code: ${code}`)
    this._yargs.exit(code)
  }
}

module.exports = Runtime
