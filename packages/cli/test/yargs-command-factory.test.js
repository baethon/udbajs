const { describe, test } = require('mocha')
const yargs = require('yargs')
const chai = require('chai')
const SignatureParser = require('../src/signature-parser')
const factory = require('../src/yargs-command-factory')
const testCases = require('./grammar/command.test-cases')
const { checkOutput } = require('./utils')

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
    const lines = parameters.map((options) => {
      const { name, type, optional, description = '', default: defaultValue, positional } = options
      const requiredString = (!optional)
        ? '\\s*\\[required\\]'
        : ''
      const defaultString = (!defaultValue)
        ? ''
        : `\\s*\\[default: ${JSON.stringify(defaultValue)}\\]`
      const prefix = positional ? '' : '--'

      return new RegExp(`${prefix}${name}\\s+${description}\\s*\\[${type}\\]${requiredString}${defaultString}`)
    })

    lines.forEach(regex => {
      const check = commandOutput.some(line => regex.test(line))

      if (!check) {
        throw new AssertionError(`Missing parameter matching: ${regex}`)
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
  testCases.forEach(([signature, name, parameters]) => {
    test(`[${signature}]`, () => {
      const _yargs = yargs()
      const dummy = {
        parsedSignature: new SignatureParser(signature),
        description: 'Command description',
      }
      factory(_yargs, dummy)

      expect().to.be.a.command(_yargs, name, dummy.description, parameters)
    })
  })
})
