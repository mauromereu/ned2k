const Buffer = require('buffer').Buffer;
const Hello = require('./Hello');

const OPCODE = 0x4C;

class HelloAnswer extends Hello {
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