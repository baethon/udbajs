const Command = require('../src/command')
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
 * @param {Command} command
 */
module.exports = (yargs, command) => {
  yargs.command(
    getCommandSignature(command.parsedSignature),
    command.constructor.description,
    defineParameters(command.parsedSignature.parameters),
    (argv) => {
      argv._promise = command.handle(argv)
    }
  )
}
