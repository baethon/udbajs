const Joi = require('@hapi/joi')
const { Parser, Grammar } = require('nearley')
const commandGrammar = require('./grammar/command')

const paramToJoiRule = (input) => {
  const {
    name,
    optional = false,
    type = 'string',
    description = null,
    default: defaultValue = undefined
  } = input
  let rule = (type === 'array')
    ? Joi.array().items(String).default([])
    : (type === 'boolean')
      ? Joi.boolean()
      : Joi.string()

  if (!optional && type !== 'array') {
    rule = rule.required()
  } else {
    rule = rule.optional()
  }

  if (defaultValue !== undefined) {
    rule = rule.default(defaultValue)
  }

  if (description) {
    rule = rule.description(description)
  }

  return {
    [name]: rule
  }
}

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
   * Get command rules
   *
   * @return {Joi}
   */
  get rules () {
    return this._parameters.reduce(
      (joiObject, param) => joiObject.append(paramToJoiRule(param)),
      Joi.object()
    )
  }
}

module.exports = SignatureParser
