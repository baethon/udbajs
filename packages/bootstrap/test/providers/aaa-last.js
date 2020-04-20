const { providerStub } = require('../stubs')

module.exports = class {
  async setup (app) {
    providerStub('last-setup', app)
  }

  async shutdown (app) {
    providerStub('last-shutdown', app)
  }
}
