const globby = require('globby')
const BaseCommand = require('./command')

class Container {
  constructor () {
    this._commands = new Map()
  }

  /**
   * @return {Map}
   */
  get commands () {
    return this._commands
  }

  add (Command) {
    if (!(Command.prototype instanceof BaseCommand)) {
      throw new Error('Only descendants of Command can be added')
    }

    const instance = new Command()
    const { parsedSignature } = instance
    this._commands.set(parsedSignature.command, instance)
  }

  /**
   * @param {String} command
   * @param {Object} [args]
   * @return {Promise<void>}
   */
  async call (command, args = {}) {
    const instance = this.commands.get(command)

    if (!instance) {
      throw new Error(`Couldn't find command [${command}]`)
    }

    return instance.handle(args)
  }

  async load(pattern) {
    const paths = await globby(pattern)

    paths.forEach(path => {
      this.add(require(path))
    })
  }
}

module.exports = Container
