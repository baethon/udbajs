const test = require('ava')
const yargs = require('yargs')
const sinon = require('sinon')
const Command = require('../src/command')
const factory = require('../src/command-factory')
const testCases = require('./grammar/command.test-cases')
const { checkOutput } = require('./utils')
const { DummyCommand, handler } = require('./stubs')
const assertCommand = require('./assert-command')

test.beforeEach(() => {
  handler.reset()
})

testCases.forEach(([signature, name, parameters]) => {
  test(`[${signature}]`, t => {
    const _yargs = yargs()
    const Dummy = class extends Command {
      static get signature () {
        return signature
      }

      static get description () {
        return 'Command description'
      }
    }
    factory(_yargs, new Dummy())

    t.notThrows(() => {
      assertCommand(_yargs, name, Dummy.description, parameters)
    })
  })
})

test.serial('appends handler to the command', t => {
  const _yargs = yargs()
  factory(_yargs, new DummyCommand())

  const { result } = checkOutput(() => _yargs.wrap(null).parse('dummy Jon --active'), ['./test'])

  t.truthy(result._promise instanceof Promise)
  t.truthy(handler.calledWith(sinon.match({
    name: 'Jon',
    active: true
  })))
})
