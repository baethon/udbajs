class InjectTest {
  constructor (foo, testFromResolve, testFromRelative) {
    this.foo = foo
    this.testFromResolve = testFromResolve
    this.testFromRelative = testFromRelative
  }

  static get $inject () {
    return ['foo', 'stubs/Test', './Test']
  }
}

module.exports = InjectTest
