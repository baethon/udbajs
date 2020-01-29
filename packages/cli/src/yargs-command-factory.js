const SignatureParser = require('../src/signature-parser')

/**
 * @param {SignatureParser} parsedSignature
 * @return {String}
 */
const getCommandSignature = (parsedSignature) => {
  const positionals = parsedSignature.parameters.filter(({ positional }) => positional)
  const parts = [parsedSignature.command].concat(positionals.map(options => {
    const { name, optional, type } = options

    return (!optional)
      ? `<${name}>`
      : (type === 'array')
      ? `[${name}...]`
      : `[${name}]`
  }))

  return parts.join(' ')
}

const defineParameters = parameters => yargs => {
  parameters.forEach(options => {
    const { name, positional, optional, type, description, default: defaultValue } = options
    const method = positional ? 'positional' : 'option'
    const commandParam = yargs[method](name, {
      description,
      default: defaultValue,
      required: !optional,
      ...(type !== 'array' && { type })
    })

    if (type === 'array') {
      commandParam.array(name)
    }
  })
}

/**
 * @param {typeof=import('yargs')} yargs
 * @param {Object} options
 * @param {SignatureParser} options.parsedSignature
 * @param {String} options.description
 */
module.exports = (yargs, { parsedSignature, description }) => {
  yargs.command(
    getCommandSignature(parsedSignature),
    description,
    defineParameters(parsedSignature.parameters),
    () => {}
  )
}
