const Buffer = require('Buffer').buffer;
const UsualPacket = require('../UsualPacket');
const hex2buf = require('../../helper/hex2buf');

const OPCODE = 0x4f;

class SetReqFileId extends UsualPacket {
  constructor(hash = '') {
    super();
    this.hash = hash;
  }

  encode() {
    let buf = Buffer.alloc(16);
    buf.write(hex2buf(this.hash), 0, 16);
    return buf;
  }

  decode(buffer) {
    super.decode(buffer);
    this.hash = buffer.toString('hex', 0, 16);
  }

  static get OPCODE() {
    return OPCODE;
  }
}

module.exports = SetReqFileId;