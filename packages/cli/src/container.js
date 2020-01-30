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

    this._commands.set(Command.parsedSignature.command, Command)
  }

  /**
   * @param {String} name
   * @param {Object} [args]
   * @return {Promise<void>}
   */
  async call (name, args = {}) {
    const Command = this.commands.get(name)

    if (!Command) {
      throw new Error(`Couldn't find command [${name}]`)
    }

    const instance = new Command()

    return instance.handle(args)
  }

  async load (pattern) {
    const paths = await globby(pattern)

    paths.forEach(path => {
      this.add(require(path))
    })
  }
}

module.exports = Container
