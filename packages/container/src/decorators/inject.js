const selfwire = require('./selfwire')

module.exports = (ClassDefinition, dependencies) => selfwire(ClassDefinition, app => {
  const resolvedDeps = dependencies.map(name => app.make(name))
  return new ClassDefinition(...resolvedDeps)
})
