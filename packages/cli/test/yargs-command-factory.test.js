const { describe, test, it, beforeEach } = require('mocha')
const yargs = require('yargs')
const chai = require('chai')
const sinon = require('sinon')
const Command = require('../src/command')
const factory = require('../src/yargs-command-factory')
const testCases = require('./grammar/command.test-cases')
const { checkOutput } = require('./utils')
const { DummyCommand, handler } = require('./stubs')

chai.use(require('chai-sinon'))
const { expect } = chai

chai.use(({ Assertion, AssertionError }) => {
  const getPositionals = (list) => {
    const filtered = list.filter(({ positional }) => positional)
    filtered.sort((a, b) => a.order - b.order)
    return filtered
  }

  const verifyCommand = (commandOutput, name, positionals) => {
    const signatureParts = [name].concat(positionals.map(options => {
      const { name, type, optional } = options

      return (!optional)
        ? `<${name}>`
        : (type === 'array')
          ? `[${name}...]`
          : `[${name}]`
    }))

    const checkRegex = new RegExp(signatureParts.join(' '))
    const check = commandOutput.some(line => checkRegex.test(line))

    if (!check) {
      throw new AssertionError(`The command signature does not match: ${checkRegex}`)
    }
  }

  const verifyParameters = (commandOutput, parameters) => {
    const linePatterns = parameters.map((options) => {
      const { name, type, optional, description = '', default: defaultValue, positional, alias = null } = options
      const prefix = positional ? '' : '--'
      const pass = /./
      const r = pattern => new RegExp(pattern)

      return [
        r(`${prefix}${name}`),
        (alias ? r(`-${alias}`) : pass),
        r(description),
        r(`\\[${type}\\]`),
        (!optional ? r('\\[required\\]') : pass),
        (defaultValue ? r(`\\[default: ${JSON.stringify(defaultValue)}\\]`) : pass)
      ]
    })

    linePatterns.forEach(patterns => {
      const check = commandOutput.some(line => patterns.every(regex => regex.test(line)))

      if (!check) {
        throw new AssertionError(`Missing parameter matching: ${patterns.join(', ')}`)
      }
    })
  }

  const verifyDescription = (commandOutput, description) => {
    const regex = new RegExp(description)
    const check = commandOutput.some(line => regex.test(line))

    if (!check) {
      throw new AssertionError(`Missing command description: ${description}`)
    }
  }

  Assertion.addMethod('command', function (yargsInstance, name, description, parameters) {
    const results = checkOutput(() => yargsInstance.wrap(null).parse(`${name} --help`), ['./test'])
    const commandOutput = results.logs[0].split(/\n+/)
    const positionals = getPositionals(parameters)

    verifyCommand(commandOutput, name, positionals)
    verifyParameters(commandOutput, parameters)
    verifyDescription(commandOutput, description)
  })
})

describe('Yargs command factory', () => {
  beforeEach(() => {
    handler.reset()
  })

  describe('params definitions', () => {
    testCases.forEach(([signature, name, parameters]) => {
      test(`[${signature}]`, () => {
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

        expect().to.be.a.command(_yargs, name, Dummy.description, parameters)
      })
    })
  })

  it('appends handler to the command', () => {
    const _yargs = yargs()
    factory(_yargs, new DummyCommand())

    const { result } = checkOutput(() => _yargs.wrap(null).parse('dummy Jon --active'), ['./test'])

    expect(result._promise).to.be.instanceOf(Promise)
    expect(handler).to.have.been.calledWith(sinon.match({
      name: 'Jon',
      active: true
    }))
  })
})
