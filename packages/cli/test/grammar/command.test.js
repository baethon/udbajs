const { describe, test, before, beforeEach } = require('mocha')
const chai = require('chai')
const nearley = require('nearley')
const { compileGrammar } = require('./utils')

const { expect } = chai

describe('Param parser', () => {
  let parser
  let grammar

  compileGrammar()

  before(() => {
    grammar = require('../../src/grammar/command')
  })

  beforeEach(() => {
    parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
  })

  const testCases = [
    ['hello', 'hello', []],
    ['hello {--active}', 'hello', [{ name: 'active', optional: true, type: 'boolean', default: false }]],
    ['hello {--active} {--name=Jon}', 'hello', [
      { name: 'active', optional: true, type: 'boolean', default: false },
      { name: 'name', optional: true, type: 'string', default: 'Jon' }
    ]],
    ['hello:world', 'hello:world', []],
    ['hello:world {--active}', 'hello:world', [{ name: 'active', optional: true, type: 'boolean', default: false }]],
    ['hello:world {--active} {--name=Jon}', 'hello:world', [
      { name: 'active', optional: true, type: 'boolean', default: false },
      { name: 'name', optional: true, type: 'string', default: 'Jon' }
    ]]
  ]

  testCases.forEach(([input, commandName, parameters]) => {
    test(input, () => {
      parser.feed(input)
      expect(parser.results).to.eql([[commandName, parameters]])
    })
  })
})
