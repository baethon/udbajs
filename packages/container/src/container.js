const pipe = require('lodash.flow')
const path = require('path')
const utils = require('./utils')

class Container {
  /**
   * @param {Object} [options]
   * @param {String} [options.root]
   */
  constructor (options = {}) {
    this.options = options
    this.bindings = {}
  }

  /**
   * Bind a factory to a given name
   *
   * The factory will be used when resolving value using `make()`.
   * Note that the `factoryFn` doesn't have to be a function. It might be an object, or a plain value.
   * Selfwired objects will resolve using the callback passed to the `selfwire()` decorator.
   *
   * @param {String} name
   * @param {Function|Object|*} factoryFn
   */
  bind (name, factoryFn) {
    this.bindings[name] = utils.resolveFactoryFn(factoryFn)
  }

  /**
   * Attempt to resolve the value bound to given `name`
   *
   * Method will try to autobind any local file paths passed.
   * To autobind local file prefix the name with `~`.
   *
   * @param {String} name
   * @return {*}
   * @throws Error when unable to resolve the binding
   */
  make (name) {
    this._autoBind(name)

    if (name in this.bindings) {
      return this.bindings[name](this)
    }

    throw new Error('Unknown binding: ', name)
  }

  /**
   * Bind already resolved value
   *
   * This method can be used to store config values,
   * or objects created outside the container.
   *
   * @param {String} name
   * @param {*} value
   */
  instance (name, value) {
    this.bind(name, utils.always(value))
  }

  /**
   * Bind a factory to a given name
   *
   * Unlike `bind()` this method will resolve the factory and cache the results.
   *
   * @param {String} name
   * @param {Function|Object|*} factoryFn
   */
  singleton (name, factoryFn) {
    this.bind(name, pipe(
      utils.resolveFactoryFn(factoryFn),
      utils.tap(result => this.instance(name, result))
    ))
  }

  /**
   * Extend the bounded value
   *
   * @param {String} name
   * @param {Function} extendFn
   */
  extend (name, extendFn) {
    this._autoBind(name)

    const bindingFn = this.bindings[name]

    this.bind(name, pipe(
      bindingFn,
      utils.tap(object => extendFn(object, this))
    ))
  }

  /**
   * @param {String} name
   * @private
   */
  _autoBind (name) {
    if (name in this.bindings) {
      return
    }

    if (name.charAt(0) !== '~') {
      throw new Error('_autoBind() works only with local files')
    }

    const { root = process.cwd() } = this.options
    const pathToResolve = path.join(root, name.substring(1))

    this.bind(name, require(pathToResolve))
  }
}

module.exports = Container
