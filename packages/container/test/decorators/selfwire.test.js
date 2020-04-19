const test = require('ava')
const { selfwire } = require('../../decorators')
const { createContainer } = require('../../')
const Test = require('../stubs/Test')

test.beforeEach(t => {
  t.context.container = createContainer()
})

test('resolve binding', t => {
  const { container } = t.context

  const selfwiredTest = selfwire(Test, app => {
    const instance = new Test()
    instance.random = app.make('random')

    return instance
  })

  container.singleton('random', Math.random)
  container.bind('test', selfwiredTest)

  t.is(container.make('random'), container.make('test').random)
})
