const always = value => _ => value

const tap = fn => value => {
  fn(value)
  return value
}

const isFunction = value => {
  if (typeof value !== 'function') {
    return false
  }

  return !/^class\s/.test(Function.prototype.toString.call(value))
}

const isClass = value => {
  if (typeof value !== 'function') {
    return false
  }

  return /^class\s/.test(Function.prototype.toString.call(value))
}

const construct = ClassDefinition => () => new ClassDefinition()

const resolveFactoryFn = (objectOrFn) => {
  if (isFunction(objectOrFn)) {
    return objectOrFn
  }

  if ('$selfwire' in objectOrFn) {
    return objectOrFn.$selfwire.factoryFn
  }

  if (isClass(objectOrFn)) {
    return construct(objectOrFn)
  }

  return always(objectOrFn)
}

module.exports = {
  always,
  tap,
  resolveFactoryFn
}
