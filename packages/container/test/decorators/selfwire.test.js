const test = require('ava')
const { selfwire } = require('../../decorators')
const { Container } = require('../../')

test.beforeEach(t => {
  t.context.container = new Container()
  t.context.Test = class {}
})

test('resolve binding', t => {
  const { container, Test } = t.context

  const selfwiredTest = selfwire(Test, app => {
    const instance = new Test()
    instance.random = app.make('random')

    return instance
  })

  container.singleton('random', Math.random)
  container.bind('test', selfwiredTest)

  t.is(container.make('random'), container.make('test').random)
})
