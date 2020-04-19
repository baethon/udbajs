const { checkOutput } = require('./utils')

const getPositionals = (list) => {
  const filtered = list.filter(({ positional }) => positional)
  filtered.sort((a, b) => a.order - b.order)
  return filtered
}

const error = (message, commandOutput) => {
  throw new Error(`${message}\n\nCommand output:\n${commandOutput.join('\n')}`)
}

const verifyCommand = (commandOutput, name, positionals) => {
  const signatureParts = [name].concat(positionals.map(options => {
    const { name, type, optional } = options

    return (!optional)
      ? `<${name}>`
      : (type === 'array')
        ? `[${name}...]` : `[${name}]`
  }))

  const checkRegex = new RegExp(signatureParts.join(' '))
  const check = commandOutput.some(line => checkRegex.test(line))

  if (!check) {
    error(`The command signature does not match: ${checkRegex}`, commandOutput)
  }
}

const verifyParameters = (commandOutput, parameters) => {
  const linePatterns = parameters.map((options) => {
    const { name, type, optional, description = '', default: defaultValue, positional, alias = null } = options
    const prefix = positional ? '' : '--'
    const pass = /./
    const r = pattern => new RegExp(pattern)
    const escapedDefaultValue = defaultValue && JSON.stringify(defaultValue)
      .replace(/([\[\]])/g, '\\$1') // eslint-disable-line

    return [
      r(`${prefix}${name}`),
      (alias ? r(`-${alias}`) : pass),
      description ? r(description) : pass,
      r(`\\[${type}\\]`),
      (!optional ? r('\\[required\\]') : pass),
      (escapedDefaultValue ? r(`\\[default: ${escapedDefaultValue}\\]`) : pass)
    ]
  })

  linePatterns.forEach(patterns => {
    const check = commandOutput.some(line => patterns.every(regex => regex.test(line)))

    if (!check) {
      error(`Missing parameter matching: ${patterns.join(', ')}`, commandOutput)
    }
  })
}

const verifyDescription = (commandOutput, description) => {
  const regex = new RegExp(description)
  const check = commandOutput.some(line => regex.test(line))

  if (!check) {
    error(`Missing command description: ${description}`, commandOutput)
  }
}

module.exports = (yargsInstance, name, description, parameters) => {
  const results = checkOutput(() => yargsInstance.wrap(null).parse(`${name} --help`), ['./test'])
  const commandOutput = results.logs[0].split(/\n+/)
  const positionals = getPositionals(parameters)

  verifyCommand(commandOutput, name, positionals)
  verifyParameters(commandOutput, parameters)
  verifyDescription(commandOutput, description)
}
