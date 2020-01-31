const globby = require('globby')
const yargs = require('yargs')
const BaseCommand = require('./command')
const factory = require('./yargs-command-factory')

const isCommand = Command => Command.prototype instanceof BaseCommand

class Runtime {
  constructor () {
    this._yargs = yargs()
  }

  add (Command) {
    if (!isCommand(Command)) {
      throw new Error('Provided command does not extend base command')
    }

    factory(this._yargs, new Command())
  }

  /**
   * @param {String|String[]} pattern
   * @param {Object} [options] globby options
   * @return {Promise<void>}
   */
  async load (pattern, options = {}) {
    const paths = await globby(pattern, options)

    paths.map(path => require(path))
      .filter(isCommand)
      .forEach(Command => {
        this.add(Command)
      })
  }

  async call (command) {
    const argv = this._yargs.parse(command)
    await argv._promise
  }

  async run (args) {
    const argv = this._yargs.demandCommand()
      .parse(args)

    await argv._promise

    return this
  }

  exit (code = 0) {
    this._yargs.exit(code)
  }
}

module.exports = Runtime
