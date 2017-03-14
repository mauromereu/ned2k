const Buffer = require('buffer').Buffer;
const UsualPacket = require('../UsualPacket');

const OPCODE = 0x14;

class GetServerList extends UsualPacket {
  encode() {
    return Buffer.alloc(0);
  }

  static get OPCODE() {
    return OPCODE;
  }
}

module.exports = GetServerList;