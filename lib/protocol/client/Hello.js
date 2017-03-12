const Buffer = require('buffer').Buffer;
const HelloAnswer = require('./HelloAnswer');

const OPCODE = 0x01;

class Hello extends HelloAnswer {
  constructor() {
    super(...arguments);
    this.userHashLength = 0;
  }

  encode() {
    let buf = super.encode();
    let hashLenBuf = Buffer.alloc(1);
    hashLenBuf.writeUInt8(16, 0);
    return Buffer.concat([hashLenBuf, buf]);
  }

  decode(buffer) {
    this.userHashLength = buffer.readUInt8(0);
    super.decode(buffer.slice(1));
  }

  static get OPCODE() {
    return OPCODE;
  }
}

module.exports = Hello;