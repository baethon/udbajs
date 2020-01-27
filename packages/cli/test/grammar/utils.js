const { spawnSync } = require('child_process')
const { before } = require('mocha')
const path = require('path')

const compileGrammar = () => {
  before(() => {
    const compileResult = spawnSync('npm', ['run', 'compile:grammar'], { cwd: path.join(__dirname, '../../') })
    const stdout = compileResult.stdout.toString()

    if (/Error/m.test(stdout)) {
      throw new Error(stdout)
    }
  })
}

module.exports = { compileGrammar }
