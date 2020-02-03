const { describe, it, beforeEach } = require('mocha')
const chai = require('chai')
const sinon = require('sinon')
const Runtime = require('../src/runtime')
const { checkOutput } = require('./utils')
const { handler } = require('./stubs')

chai.use(require('chai-sinon'))
const { expect } = chai

describe('Runtime', () => {
  let runtime

  beforeEach(async () => {
    handler.reset()

    runtime = new Runtime({
      commands: `${__dirname}/stubs/dummy-command.command.js`
    })
    await runtime.load()

    return runtime
  })

  describe('call()', () => {
    it('allows to use command string', async () => {
      await runtime.call('dummy Jon --hello')

      expect(handler).to.have.been.calledWith(sinon.match({ name: 'Jon', hello: true }))
    })

    it('allows to use array', async () => {
      await runtime.call(['dummy', 'Jon', '--hello'])

      expect(handler).to.have.been.calledWith(sinon.match({ name: 'Jon', hello: true }))
    })

    it('should fail when given undefined options', () => {
      const result = checkOutput(() => runtime.call('dummy Jon --foo'))
      const check = result.errors.some(line => /Unknown argument: foo/.test(line))

      expect(check).to.equal(true)
    })

    it('should throw error when calling undefined command', () => {
      const result = checkOutput(() => runtime.run('foo'))
      const check = result.errors.some(line => /Unknown argument: foo/.test(line))

      expect(check).to.equal(true)
    })
  })

  describe('run()', () => {
    it('runs yargs', () => {
      const result = checkOutput(() => runtime.run(''), ['./test'])
      const check = result.errors.some(line => /Not enough non-option arguments/.test(line))

      expect(check).to.equal(true)
    })

    it('runs selected command', async () => {
      const result = checkOutput(() => runtime.run('dummy Jon'), ['./test'])

      await result.result

      expect(handler).to.have.been.calledWith(sinon.match({ name: 'Jon', hello: false }))
    })

    it('should fail when given undefined options', () => {
      const result = checkOutput(() => runtime.run('dummy Jon --foo'))
      const check = result.errors.some(line => /Unknown argument: foo/.test(line))

      expect(check).to.equal(true)
    })
  })
})
