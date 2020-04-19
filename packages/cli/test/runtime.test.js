const test = require('ava')
const sinon = require('sinon')
const Runtime = require('../src/runtime')
const { checkOutput } = require('./utils')
const { handler } = require('./stubs')

test.beforeEach(async t => {
  handler.reset()

  t.context.runtime = new Runtime({
    commands: `${__dirname}/stubs/dummy-command.command.js`
  })

  await t.context.runtime.load()
})

test.serial('call() | allows to use command string', async t => {
  const { runtime } = t.context
  await runtime.call('dummy Jon --hello')

  t.truthy(handler.calledWith(sinon.match({ name: 'Jon', hello: true })))
})

test.serial('call() | allows to use array', async t => {
  const { runtime } = t.context
  await runtime.call(['dummy', 'Jon', '--hello'])

  t.truthy(handler.calledWith(sinon.match({ name: 'Jon', hello: true })))
})

test.serial('call() | should fail when given undefined options', t => {
  const { runtime } = t.context
  const result = checkOutput(() => runtime.call('dummy Jon --foo'))
  const check = result.errors.some(line => /Unknown argument: foo/.test(line))

  t.true(check)
})

test.serial('call() | should throw error when calling undefined command', t => {
  const { runtime } = t.context
  const result = checkOutput(() => runtime.run('foo'))
  const check = result.errors.some(line => /Unknown argument: foo/.test(line))

  t.true(check)
})

test.serial('run() | runs yargs', t => {
  const { runtime } = t.context
  const result = checkOutput(() => runtime.run(''), ['./test'])
  const check = result.errors.some(line => /Not enough non-option arguments/.test(line))

  t.true(check)
})

test.serial('run() | runs selected command', async t => {
  const { runtime } = t.context
  const result = checkOutput(() => runtime.run('dummy Jon'), ['./test'])

  await result.result

  t.truthy(handler.calledWith(sinon.match({ name: 'Jon', hello: false })))
})

test.serial('run() | should fail when given undefined options', t => {
  const { runtime } = t.context
  const result = checkOutput(() => runtime.run('dummy Jon --foo'))
  const check = result.errors.some(line => /Unknown argument: foo/.test(line))

  t.true(check)
})
