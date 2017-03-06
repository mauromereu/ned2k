const UsualPacket = require('../UsualPacket');

const OPCODE = 0X40;

class IdChange extends UsualPacket {
  constructor() {
    super();
    this.newId = 0x0;
  }

  decode(buf) {
    this.newId = buf.readUInt32LE(0);
  }

  static get OPCODE() {
    return OPCODE;
  }
}

module.exports = IdChange;