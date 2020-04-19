const test = require('ava')
const { providerStub } = require('./stubs')
const Bootstrap = require('../src/bootstrap')

const mapProviderArgs = provider => provider.getCalls()
  .map(({ args }) => args)

test.beforeEach(t => {
  t.context.app = new Bootstrap(`${__dirname}/providers/`)
  providerStub.reset()
})

test.serial('setup() runs providers in valid order', async t => {
  const { app } = t.context
  await app.setup()

  t.deepEqual(mapProviderArgs(providerStub), [
    ['first-setup'],
    ['second-setup'],
    ['last-setup']
  ])
})

test.serial('shutdown() runs providers in valid order', async t => {
  const { app } = t.context
  await app.setup()

  providerStub.reset()
  await app.shutdown()

  t.deepEqual(mapProviderArgs(providerStub), [
    ['last-shutdown'],
    ['first-shutdown']
  ])
})
