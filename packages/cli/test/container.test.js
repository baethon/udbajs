const { describe, it, beforeEach } = require('mocha')
const chai = require('chai')
const Container = require('../src/container')
const DummyCommand  = require('./stubs/dummy-command.command')
const handleStub = require('./stubs/handler')

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
      expect(container.commands.get('dummy')).to.be.instanceOf(DummyCommand)
    })

    it(`forbids adding classes that don't inherit from Command`, () => {
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
        hello: true,
      })
    })

    it('throws error when calling undefined command', (done) => {
      container.call('foo')
        .then(() => done(new Error('call() should fail')))
        .catch(() => done())
    })
  })
})
