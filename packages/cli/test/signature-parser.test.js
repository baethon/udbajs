const { describe, it, test } = require('mocha')
const chai = require('chai')
const SignatureParser = require('../src/signature-parser')
const testCases = require('./grammar/command.test-cases')

const { expect } = chai

describe('SignatureParser', () => {
  describe('command name', () => {
    testCases.forEach(([signature, name, parameters]) => {
      test(`[${signature}]`, () => {
        expect(new SignatureParser(signature).command).to.equal(name)
      })
    })
  })

  describe('command parameters', () => {
    testCases.forEach(([signature, _, parameters]) => {
      test(`[${signature}]`, () => {
        expect(new SignatureParser(signature).parameters).to.eql(parameters)
      })
    })
  })
})
