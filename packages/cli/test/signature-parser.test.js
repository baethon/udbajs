const { describe, it } = require('mocha')
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
    describe('positional parameters', () => {
      it('parses required params', () => {
        expect(new SignatureParser('foo {name} {bar}').rules).to.be.a.rule(Joi.object({
          name: Joi.string().required(),
          bar: Joi.string().required()
        }))
      })

      it('parses optional parameters', () => {
        expect(new SignatureParser('foo {name?}').rules).to.be.a.rule(Joi.object({
          name: Joi.string().optional()
        }))
      })

      it('parses array parameters', () => {
        expect(new SignatureParser('foo {name*}').rules).to.be.a.rule(Joi.object({
          name: Joi.array().items(String).optional().default([])
        }))
      })

      it('extracts description', () => {
        expect(new SignatureParser('foo {name : The desc of param}').rules).to.be.a.rule(Joi.object({
          name: Joi.string().required().description('The desc of param')
        }))
      })
    })

    describe('flagged parameters', () => {
      it('parses boolean params', () => {
        expect(new SignatureParser('foo {--hello}').rules).to.be.a.rule(Joi.object({
          hello: Joi.boolean().default(false).optional()
        }))
      })

      it('parses single string params', () => {
        expect(new SignatureParser('foo {--hello=}').rules).to.be.a.rule(Joi.object({
          hello: Joi.string().default('').optional()
        }))
      })
    })
  })
})
