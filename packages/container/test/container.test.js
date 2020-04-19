const test = require('ava')
const { Container } = require('../')
const sinon = require('sinon')
const Test = require('./stubs/Test')
const InjectTest = require('./stubs/InjectTest')

test.beforeEach(t => {
  t.context.container = new Container()
})

test('resolves bound instances', t => {
  const { container } = t.context
  const instance = {}

  container.instance('test', instance)

  t.is(instance, container.make('test'))
})

test('binds instance factories', t => {
  const { container } = t.context
  const spy = sinon.stub()
  const expectedResult = {}

  spy.returns(expectedResult)

  container.bind('test', spy)

  t.is(expectedResult, container.make('test'))
  t.truthy(spy.calledWith(container))
})

test('binds singleton factory', t => {
  const { container } = t.context

  container.singleton('test', Math.random)

  const result = container.make('test')

  t.truthy(result)
  t.is(result, container.make('test'))
})

test('resolve local modules | plain objects', t => {
  const container = new Container({
    root: __dirname
  })

  const config = container.make('~stubs/config')
  t.deepEqual(config, {
    hello: 'there!'
  })
})

test('resolve local modules | selfwired objects', t => {
  const container = new Container({
    root: __dirname
  })

  container.singleton('random', Math.random)

  const config = container.make('~stubs/selfwired-config')
  t.deepEqual(config, {
    hello: 'there!',
    random: container.make('random')
  })
})

test.skip('Automatic class resolving | resolves class', t => {
  const { container } = t.context
  container.addResolveDir(__dirname)

  const test = container.make('stubs/Test')

  t.true(test instanceof Test)
})

test.skip('Automatic class resolving | injects resolved instances', t => {
  const { container } = t.context
  container.addResolveDir(__dirname)

  container.instance('foo', 'foo')

  const injectTest = container.make('stubs/InjectTest')

  t.true(injectTest instanceof InjectTest)
  t.true(injectTest.testFromResolve instanceof Test)
  t.is('foo', injectTest.foo)
})

test('Extending objects | allows to extend bound objects', t => {
  const { container } = t.context

  const extendFn = object => {
    object.foo = 'foo'
  }
  const spy = sinon.spy(extendFn)

  container.bind('test', () => new Test())
  container.extend('test', spy)

  const test = container.make('test')

  t.true(test instanceof Test)
  t.is('foo', test.foo)
  t.truthy(spy.calledWith(test, container))
})

test('Extending objects | allows to extend singleton', t => {
  const { container } = t.context

  const spy = sinon.spy(test => {
    test.foo = Math.random()
  })

  container.singleton('test', () => new Test())
  container.extend('test', spy)

  const instance = container.make('test')
  const { foo } = instance

  const secondInstance = container.make('test')

  t.is(instance, secondInstance)
  t.is(foo, secondInstance.foo)
  t.truthy(spy.calledOnce)
})

test.skip('Extending objects | allows to extend unbound class factories', t => {
  const { container } = t.context
  container.addResolveDir(__dirname)

  container.extend('stubs/Test', test => {
    test.foo = 'foo'
  })

  const test = container.make('stubs/Test')

  t.true(test instanceof Test)
  t.is('foo', test.foo)
})

test('binding selfwired object', t => {
  const { container } = t.context
  container.singleton('random', Math.random)

  const selfwired = {
    $selfwire: {
      factoryFn: (app) => {
        return app.make('random')
      }
    }
  }

  container.bind('test', selfwired)

  t.is(container.make('random'), container.make('test'))
})
