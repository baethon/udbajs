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
    ['hello {--active}', 'hello', [{ name: 'active', optional: true, type: 'boolean', default: false, positional: false, order: 0 }]],
    ['hello {--active} {--name=Jon}', 'hello', [
      { name: 'active', optional: true, type: 'boolean', default: false, positional: false, order: 0 },
      { name: 'name', optional: true, type: 'string', default: 'Jon', positional: false, order: 1 }
    ]],
    ['hello:world', 'hello:world', []],
    ['hello:world {--active}', 'hello:world', [{ name: 'active', optional: true, type: 'boolean', default: false, positional: false, order: 0 }]],
    ['hello {--active : Only active} {--bar}', 'hello', [
      { name: 'active', optional: true, type: 'boolean', description: 'Only active', default: false, positional: false, order: 0 },
      { name: 'bar', optional: true, type: 'boolean', default: false, positional: false, order: 1 }
    ]]
  ]

  testCases.forEach(([input, commandName, parameters]) => {
    test(input, () => {
      parser.feed(input)
      const [first] = parser.results
      expect(first).to.eql([commandName, parameters])
    })
  })
})
