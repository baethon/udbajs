const test = require('ava')
const { providerStub } = require('./stubs')
const Bootstrap = require('../src/bootstrap')

const mapProviderArgs = provider => provider.getCalls()
  .map(({ args }) => args)

test.beforeEach(t => {
  t.context.bootstrap = new Bootstrap(`${__dirname}/providers/`)
  providerStub.reset()
})

test.serial('setup() | run providers in valid order', async t => {
  const { bootstrap } = t.context
  await bootstrap.setup()

  t.deepEqual(mapProviderArgs(providerStub), [
    ['first-setup'],
    ['second-setup'],
    ['last-setup', undefined]
  ])
})

test.serial('setup() | pass given arguments to providers', async t => {
  const app = { random: Math.random() }
  const bootstrap = new Bootstrap(`${__dirname}/providers/`, {
    args: [app]
  })

  await bootstrap.setup()

  const expected = [
    ['first-setup'],
    ['second-setup'],
    ['last-setup', app]
  ]

  t.deepEqual(expected, mapProviderArgs(providerStub))
})

test.serial('shutdown() | run providers in valid order', async t => {
  const { bootstrap } = t.context
  await bootstrap.setup()

  providerStub.reset()
  await bootstrap.shutdown()

  const expected = [
    ['last-shutdown', undefined],
    ['first-shutdown']
  ]

  t.deepEqual(expected, mapProviderArgs(providerStub))
})

test.serial('shutdown() | pass given arguments to providers', async t => {
  const app = { random: Math.random() }
  const bootstrap = new Bootstrap(`${__dirname}/providers/`, {
    args: [app]
  })

  await bootstrap.setup()
  providerStub.reset()

  await bootstrap.shutdown()

  const expected = [
    ['last-shutdown', app],
    ['first-shutdown']
  ]

  t.deepEqual(expected, mapProviderArgs(providerStub))
})
