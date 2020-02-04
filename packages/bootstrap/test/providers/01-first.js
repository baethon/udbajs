const { providerStub } = require('../stubs')

module.exports = class {
  async setup () {
    providerStub('first-setup')
  }

  async shutdown () {
    providerStub('first-shutdown')
  }
}
