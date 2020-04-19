const path = require('path')
const utils = require('./utils')
const cond = require('lodash.cond')
const pipe = require('lodash.flow')

const moduleExists = module => {
  try {
    require.resolve(module)
    return true
  } catch (err) {
    return false
  }
}

const getInjects = Factory => Factory.$inject || []
const resolveLocalInjects = modulePath => utils.map(cond([
  [utils.startsWith('.'), injectPath => path.resolve(`${path.dirname(modulePath)}/${injectPath}`)],
  [utils.otherwise, utils.identity]
]))

const getResolvedInjects = (modulePath, make) => pipe(
  getInjects,
  resolveLocalInjects(modulePath),
  utils.map(make)
)

const findModule = modulePaths => modulePaths.find(moduleExists)

const generatePossibleModulePaths = (dirs, moduleName) => dirs
  .map(dir => `${dir}/${moduleName}`)

module.exports = () => {
  const dirs = []

  const createClassInstance = (name, make) => {
    const possiblePaths = generatePossibleModulePaths(dirs, name)
    const modulePath = findModule([name].concat(possiblePaths))

    const Factory = require(modulePath)
    const injects = getResolvedInjects(modulePath, make)(Factory)

    return new Factory(...injects)
  }

  const addDir = dir => {
    dirs.push(dir.replace(new RegExp('/$'), ''))
  }

  return { createClassInstance, addDir }
}
