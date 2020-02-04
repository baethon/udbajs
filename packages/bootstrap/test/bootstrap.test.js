const { describe, it, beforeEach } = require('mocha')
const chai = require('chai')
const { providerStub } = require('./stubs')
const Bootstrap = require('../src/bootstrap')

const { expect } = chai
const mapProviderArgs = provider => provider.getCalls()
  .map(({ args }) => args)

describe('Bootstrap', () => {
  let app

  beforeEach(() => {
    providerStub.reset()
    app = new Bootstrap(`${__dirname}/providers/`)
  })

  it('setup() runs providers in valid order', async () => {
    await app.setup()

    expect(mapProviderArgs(providerStub)).to.eql([
      ['first-setup'],
      ['second-setup'],
      ['last-setup']
    ])
  })

  it('shutdown() runs providers in valid order', async () => {
    await app.setup()

    providerStub.reset()
    await app.shutdown()

    expect(mapProviderArgs(providerStub)).to.eql([
      ['last-shutdown'],
      ['first-shutdown']
    ])
  })
})
