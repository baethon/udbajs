const { describe, it, beforeEach } = require('mocha')
const chai = require('chai')
const path = require('path')
const Container = require('../src/container')
const { DummyCommand, handler: handleStub } = require('./stubs')

chai.use(require('chai-sinon'))
const { expect } = chai

describe('Container', () => {
  let container

  beforeEach(() => {
    handleStub.reset()
    container = new Container()
  })

  describe('add()', () => {
    it('allows to add a command', () => {
      container.add(DummyCommand)
      expect(container.commands.get('dummy')).to.equal(DummyCommand)
    })

    it('forbids adding classes that don\'t inherit from Command', () => {
      expect(() => {
        container.add(class {})
      }).to.throw('Only descendants of Command can be added')
    })
  })

  describe('call()', () => {
    it('calls selected command', async () => {
      container.add(DummyCommand)

      await container.call('dummy', {
        name: 'Jon',
        hello: true
      })

      expect(handleStub).to.have.been.calledWith({
        name: 'Jon',
        hello: true
      })
    })

    it('throws error when calling undefined command', (done) => {
      container.call('foo')
        .then(() => done(new Error('call() should fail')))
        .catch(() => done())
    })
  })

  describe('load()', () => {
    it('loads commands using glob patterns', async () => {
      await container.load(path.join(__dirname, 'stubs', '*.command.js'))
      expect(container.commands.get('dummy')).to.exist // eslint-disable-line
    })
  })
})
