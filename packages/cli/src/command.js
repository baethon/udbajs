const SignatureParser = require('./signature-parser')

class Command {
  static get signature() {
    throw new Error('Implementation missing')
  }

  static get description() {
    throw new Error('Implementation missing')
  }

  constructor () {
    this._parsedSignature = new SignatureParser(this.constructor.signature)
  }

  /**
   * @return {SignatureParser}
   */
  get parsedSignature () {
    return this._parsedSignature
  }

  /**
   * Executes the command
   *
   * @param {Object} parameters
   * @return {Promise<void>}
   * @abstract
   */
  async handle(parameters) {
  }
}

module.exports = Command
