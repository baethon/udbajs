const { describe, test, before, beforeEach } = require('mocha')
const chai = require('chai')
const nearley = require('nearley')
const { compileGrammar } = require('./utils')
const testCases = require('./command.test-cases')

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

  testCases.forEach(([input, commandName, parameters]) => {
    test(input, () => {
      parser.feed(input)
      const [first] = parser.results
      expect(first).to.eql([commandName, parameters])
    })
  })
})
