const { describe, it } = require('mocha')
const chai = require('chai')
const SignatureParser = require('../src/signature-parser')
const Command = require('../src/command')

const { expect } = chai

class DummyCommand extends Command {
  static get signature () {
    return 'dummy {--hello} {name}'
  }

  static get description () {
    return 'Dummy command'
  }
}

describe('Command', () => {
  it('parses signature', () => {
    const instance = new DummyCommand()
    expect(instance.parsedSignature).to.eql(new SignatureParser(DummyCommand.signature))
  })
})
