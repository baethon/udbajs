const test = require('ava')
const { inject } = require('../../decorators')
const { Container } = require('../../')
const FooStub = require('../stubs/foo-stub')

test.beforeEach(t => {
  t.context.container = new Container({
    root: `${__dirname}/../`
  })

  t.context.Test = class {
    constructor (first, second) {
      this.first = first
      this.second = second
    }
  }
})

test('inject bounded value', t => {
  const { container, Test } = t.context

  container.bind('test', inject(Test, ['random']))
  container.singleton('random', Math.random)

  const instance = container.make('test')

  t.true(instance instanceof Test)
  t.is(container.make('random'), instance.first)
})

test('inject local module', t => {
  const { container, Test } = t.context

  container.bind('test', inject(Test, ['~stubs/foo-stub']))

  const instance = container.make('test')

  t.true(instance instanceof Test)
  t.true(instance.first instanceof FooStub)
})

test('inject both deps', t => {
  const { container, Test } = t.context

  container.bind('test', inject(Test, ['~stubs/foo-stub', 'random']))
  container.singleton('random', Math.random)

  const instance = container.make('test')

  t.true(instance instanceof Test)
  t.true(instance.first instanceof FooStub)
  t.is(container.make('random'), instance.second)
})
