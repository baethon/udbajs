const test = require('ava')
const { providerStub } = require('./stubs')
const Bootstrap = require('../src/bootstrap')

const mapProviderArgs = provider => provider.getCalls()
  .map(({ args }) => args)

test.beforeEach(t => {
  t.context.bootstrap = new Bootstrap(`${__dirname}/providers/`)
  providerStub.reset()
})

test.serial('setup() runs providers in valid order', async t => {
  const { bootstrap } = t.context
  await bootstrap.setup()

  t.deepEqual(mapProviderArgs(providerStub), [
    ['first-setup'],
    ['second-setup'],
    ['last-setup', undefined]
  ])
})

test.serial('setup() | pass given arguments to providers', async t => {
  const { bootstrap } = t.context
  const app = { random: Math.random() }
  await bootstrap.setup(app)

  t.deepEqual(mapProviderArgs(providerStub), [
    ['first-setup'],
    ['second-setup'],
    ['last-setup', app]
  ])
})

test.serial('shutdown() runs providers in valid order', async t => {
  const { bootstrap } = t.context
  await bootstrap.setup()

  providerStub.reset()
  await bootstrap.shutdown()

  t.deepEqual(mapProviderArgs(providerStub), [
    ['last-shutdown'],
    ['first-shutdown']
  ])
})
