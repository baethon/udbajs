const Joi = require('@hapi/joi')

const paramToJoiRule = (input) => {
  const {
    name,
    required,
    type = 'string',
    description = null
  } = parseSingleParam(input)
  let rule = (type === 'array')
    ? Joi.array().items(String).default([])
    : (type === 'boolean')
      ? Joi.boolean().default(false)
      : Joi.string()

  if (required && type !== 'array') {
    rule = rule.required()
  } else {
    rule = rule.optional()
  }

  if (description) {
    rule = rule.description(description)
  }

  return {
    [name]: rule
  }
}

const parseSingleParam = (param) => {
  const flagged = /^--/.test(param)
  const name = param.replace(/^(--)?(\w+).*$/, '$2')
  const [, positionalFlags] = /^\w+([?*])/.exec(param) || []
  const [, description] = /:\s*(.+?)$/.exec(param) || []

  return {
    name,
    required: (!flagged && positionalFlags !== '?'),
    type: (positionalFlags === '*')
      ? 'array'
      : (flagged)
        ? 'boolean'
        : 'string',
    description: description && description.trim()
  }
}

class SignatureParser {
  /**
   * @constructor
   * @param {String} signature
   */
  constructor (signature) {
    this.signature = signature.trim()
  }

  /**
   * Get command name
   *
   * @return {String}
   */
  get command () {
    const [name] = this.signature.split(/\s+/)
    return name
  }

  /**
   * Get command rules
   *
   * @return {Joi}
   */
  get rules () {
    const rawParams = this._getRawParameters()

    return rawParams.reduce(
      (joiObject, paramSignature) => joiObject.append(paramToJoiRule(paramSignature)),
      Joi.object()
    )
  }

  /**
   * Get raw parameters definition
   *
   * @return {String[]}
   * @private
   */
  _getRawParameters () {
    const results = []

    return results
  }
}

module.exports = SignatureParser
