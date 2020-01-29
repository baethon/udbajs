const Command = require('../../src/command')
const handler = require('./handler')

class DummyCommand extends Command {
  static get signature () {
    return 'dummy {--hello} {name}'
  }

  static get description () {
    return 'Dummy command'
  }

  async handle (parameters) {
    handler(parameters)
  }
}

module.exports = DummyCommand
