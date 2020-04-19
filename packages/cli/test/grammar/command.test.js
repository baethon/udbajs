const test = require('ava')
const nearley = require('nearley')
const testCases = require('./command.test-cases')

test.serial.before(t => {
  t.context.grammar = require('../../src/grammar/command')
})

test.beforeEach(t => {
  t.context.parser = new nearley.Parser(nearley.Grammar.fromCompiled(t.context.grammar))
})

testCases.forEach(([input, commandName, parameters]) => {
  test(input, t => {
    const { parser } = t.context

    parser.feed(input)
    const [first] = parser.results

    t.deepEqual([commandName, parameters], first)
  })
})
