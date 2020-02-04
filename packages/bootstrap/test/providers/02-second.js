const { providerStub } = require('../stubs')

module.exports = class {
  async setup () {
    providerStub('second-setup')
  }
}
