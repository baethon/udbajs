module.exports = (ClassDefinition, factoryFn) => {
  Object.defineProperty(ClassDefinition, '$selfwire', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: {
      factoryFn
    }
  })

  return ClassDefinition
}
