const { describe, it, test } = require('mocha')
const chai = require('chai')
const Joi = require('@hapi/joi')
const SignatureParser = require('../src/signature-parser')

const { expect } = chai

chai.use(({ Assertion }) => {
  Assertion.addMethod('rule', function (expected) {
    const actual = this._obj
    new Assertion(actual.describe()).to.eql(expected.describe())
  })
})

describe('SignatureParser', () => {
  it('returns command name', () => {
    expect(new SignatureParser('foo').command).to.equal('foo')
    expect(new SignatureParser('foo:bar').command).to.equal('foo:bar')
    expect(new SignatureParser('foo:bar {name?}').command).to.equal('foo:bar')
  })

  describe('command parameters', () => {
    const testCases = [
      ['foo {name} {bar}', {
        name: Joi.string().required(),
        bar: Joi.string().required()
      }],
      ['foo {name?}', {
        name: Joi.string().optional()
      }],
      ['foo {name*}', {
        name: Joi.array().items(String).default([]).optional()
      }],
      ['foo {name : The desc of param}', {
        name: Joi.string().required().description('The desc of param')
      }],
      ['foo {--hello}', {
        hello: Joi.boolean().default(false).optional()
      }],
      ['foo {--hello=}', {
        hello: Joi.string().default('').optional()
      }],
      ['foo {--hello=Jon}', {
        hello: Joi.string().default('Jon').optional()
      }],
      ['foo {--hello="Jon Snow"}', {
        hello: Joi.string().default('Jon Snow').optional()
      }],
      ['foo {--hello=\'Jon Snow\'}', {
        hello: Joi.string().default('Jon Snow').optional()
      }],
      ['foo {--hello=* : Say hi} {--bar}', {
        hello: Joi.array().items(String).default([]).optional().description('Say hi'),
        bar: Joi.boolean().default(false).optional()
      }]
    ]

    testCases.forEach(([signature, expected]) => {
      test(`[${signature}]`, () => {
        expect(new SignatureParser(signature).rules).to.be.a.rule(Joi.object(expected))
      })
    })
  })
})
