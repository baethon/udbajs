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
    const { name, positional, optional, type, description, default: defaultValue, alias } = options
    const method = positional ? 'positional' : 'option'
    const commandParam = yargs[method](name, {
      description,
      default: defaultValue,
      required: !optional,
      ...(type !== 'array' && { type }),
      ...(alias && { alias })
    })

    if (type === 'array') {
      commandParam.array(name)
    }
  })
}

/**
 * @param {Object} yargs
 * @param {Command} command
 */
module.exports = (yargs, command) => {
  const { constructor } = command
  yargs.command(
    getCommandSignature(constructor.parsedSignature),
    constructor.description,
    defineParameters(constructor.parsedSignature.parameters),
    (argv) => {
      argv._promise = command.handle(argv)
    }
  )
}
