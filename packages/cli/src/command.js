const SignatureParser = require('./signature-parser')

class Command {
  static get signature () {
    throw new Error('Implementation missing')
  }

  static get description () {
    throw new Error('Implementation missing')
  }

  /**
   * @return {SignatureParser}
   */
  static get parsedSignature () {
    const parsedSignature = new SignatureParser(this.signature)

    // memoize the parsedSignature
    Object.defineProperty(this, 'parsedSignature', {
      get: () => parsedSignature,
      enumerable: true
    })

    return parsedSignature
  }

  /**
   * Executes the command
   *
   * @param {Object} parameters
   * @return {Promise<void>}
   * @abstract
   */
  async handle (parameters) {
  }
}

module.exports = Command
