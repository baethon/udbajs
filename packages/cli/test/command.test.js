const { describe, it } = require('mocha')
const chai = require('chai')
const SignatureParser = require('../src/signature-parser')
const { DummyCommand } = require('./stubs')

const { expect } = chai

describe('Command', () => {
  it('parses signature', () => {
    expect(DummyCommand.parsedSignature).to.eql(new SignatureParser(DummyCommand.signature))
  })
})
