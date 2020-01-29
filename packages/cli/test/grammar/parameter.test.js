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
    grammar = require('../../src/grammar/parameter')
  })

  beforeEach(() => {
    parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
  })

  const testCases = [
    ['foo', { name: 'foo', type: 'string', positional: true }],
    ['foo*', { name: 'foo', type: 'array', default: [], positional: true }],
    ['foo?', { name: 'foo', type: 'string', optional: true, positional: true }],
    ['foo : It\'s a foo!', { name: 'foo', type: 'string', description: 'It\'s a foo!', positional: true }],
    ['foo* : It\'s a foo!', { name: 'foo', type: 'array', default: [], description: 'It\'s a foo!', positional: true }],
    ['foo? : It\'s a foo!', { name: 'foo', type: 'string', optional: true, description: 'It\'s a foo!', positional: true }],
    ['--foo=bar', { name: 'foo', type: 'string', default: 'bar', optional: true, positional: false }],
    ['--foo="foo bar"', { name: 'foo', type: 'string', default: 'foo bar', optional: true, positional: false }],
    ['--foo=\'foo bar\'', { name: 'foo', type: 'string', default: 'foo bar', optional: true, positional: false }],
    ['--foo', { name: 'foo', type: 'boolean', default: false, optional: true, positional: false }],
    ['--foo=', { name: 'foo', type: 'string', default: '', optional: true, positional: false }],
    ['--f|foo=', { name: 'foo', type: 'string', default: '', optional: true, alias: 'f', positional: false }],
    ['--foo=*', { name: 'foo', type: 'array', default: [], optional: true, positional: false }],
    ['--f|foo=bar', { name: 'foo', type: 'string', default: 'bar', optional: true, alias: 'f', positional: false }],
    ['--f|foo="foo bar"', { name: 'foo', type: 'string', default: 'foo bar', optional: true, alias: 'f', positional: false }],
    ['--f|foo=\'foo bar\'', { name: 'foo', type: 'string', default: 'foo bar', optional: true, alias: 'f', positional: false }],
    ['--f|foo', { name: 'foo', type: 'boolean', default: false, optional: true, alias: 'f', positional: false }],
    ['--f|foo=*', { name: 'foo', type: 'array', default: [], optional: true, alias: 'f', positional: false }],
    ['--foo=bar : It\'s a foo!', { name: 'foo', type: 'string', default: 'bar', optional: true, description: 'It\'s a foo!', positional: false }],
    ['--foo="foo bar" : It\'s a foo!', { name: 'foo', type: 'string', default: 'foo bar', optional: true, description: 'It\'s a foo!', positional: false }],
    ['--foo=\'foo bar\' : It\'s a foo!', { name: 'foo', type: 'string', default: 'foo bar', optional: true, description: 'It\'s a foo!', positional: false }],
    ['--foo : It\'s a foo!', { name: 'foo', type: 'boolean', default: false, optional: true, description: 'It\'s a foo!', positional: false }],
    ['--foo=* : It\'s a foo!', { name: 'foo', type: 'array', default: [], optional: true, description: 'It\'s a foo!', positional: false }],
    ['--f|foo=bar : It\'s a foo!', { name: 'foo', type: 'string', default: 'bar', optional: true, alias: 'f', description: 'It\'s a foo!', positional: false }],
    ['--f|foo="foo bar" : It\'s a foo!', { name: 'foo', type: 'string', default: 'foo bar', optional: true, alias: 'f', description: 'It\'s a foo!', positional: false }],
    ['--f|foo=\'foo bar\' : It\'s a foo!', { name: 'foo', type: 'string', default: 'foo bar', optional: true, alias: 'f', description: 'It\'s a foo!', positional: false }],
    ['--f|foo : It\'s a foo!', { name: 'foo', type: 'boolean', default: false, optional: true, alias: 'f', description: 'It\'s a foo!', positional: false }],
    ['--f|foo=* : It\'s a foo!', { name: 'foo', type: 'array', default: [], optional: true, alias: 'f', description: 'It\'s a foo!', positional: false }]
  ]

  testCases.forEach(([input, expected]) => {
    test(`[${input}]`, () => {
      parser.feed(input)
      const [first] = parser.results
      expect(first).to.eql(expected)
    })
  })
})