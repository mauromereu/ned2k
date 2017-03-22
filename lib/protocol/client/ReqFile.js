const Buffer = require('buffer').Buffer;
const UsualPacket = require('../UsualPacket');
const hex2buf = require('../../helper/hex2buf');

const OPCODE = 0x58;

class ReqFile extends UsualPacket {
  constructor(hash = '') {
    super();
    this.hash = hash;
  }

  encode() {
    let buffer = Buffer.alloc(16);
    buffer.fill(hex2buf(this.hash), 0, 16);
    return buffer;
  }

  decode(buffer) {
    super.decode(buffer);
    this.hash = buffer.toString('hex', 0, 16);
  }

  static get OPCODE() {
    return OPCODE;
  }
}