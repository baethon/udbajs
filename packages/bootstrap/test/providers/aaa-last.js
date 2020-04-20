const { providerStub } = require('../stubs')

module.exports = class {
  constructor (app) {
    this.app = app
  }

  async setup () {
    providerStub('last-setup', this.app)
  }

  async shutdown () {
    providerStub('last-shutdown')
  }
}
