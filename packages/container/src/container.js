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

  bind (name, factoryFn) {
    this.bindings[name] = utils.resolveFactoryFn(factoryFn)
  }

  make (name) {
    this._autoBind(name)

    if (name in this.bindings) {
      return this.bindings[name](this)
    }

    throw new Error('Unknown binding: ', name)
  }

  instance (name, object) {
    this.bind(name, utils.always(object))
  }

  singleton (name, factoryFn) {
    this.bind(name, pipe(
      utils.resolveFactoryFn(factoryFn),
      utils.tap(result => this.instance(name, result))
    ))
  }

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

    const pathToResolve = (name.charAt(0) === '~')
      ? path.join(this.options.root, name.substring(1))
      : name

    try {
      this.bind(name, require(pathToResolve))
    } catch (err) {
      throw new Error('Unable to automatically bind: ', name)
    }
  }
}

module.exports = Container
