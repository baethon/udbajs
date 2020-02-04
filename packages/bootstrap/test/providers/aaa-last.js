const { providerStub } = require('../stubs')

module.exports = class {
  async setup () {
    providerStub('last-setup')
  }

  async shutdown () {
    providerStub('last-shutdown')
  }
}
