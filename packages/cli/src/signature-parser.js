const { Parser, Grammar } = require('nearley')
const commandGrammar = require('./grammar/command')

class SignatureParser {
  /**
   * @constructor
   * @param {String} signature
   */
  constructor (signature) {
    const { name, parameters } = this._parseSignature(signature)

    this._name = name
    this._parameters = parameters
  }

  _parseSignature (signature) {
    const parser = new Parser(Grammar.fromCompiled(commandGrammar))
    parser.feed(signature.replace('\n', '').trim())
    const [[name, parameters]] = parser.results

    return { name, parameters }
  }

  /**
   * Get command name
   *
   * @return {String}
   */
  get command () {
    return this._name
  }

  /**
   * Get commands parameters
   *
   * @return {Object[]}
   */
  get parameters () {
    return this._parameters
  }
}

module.exports = SignatureParser
