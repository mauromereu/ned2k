const UsualPacket = require('../UsualPacket');

const OPCODE = 0x40;

class IdChange extends UsualPacket {
  constructor() {
    super();
    this.newId = 0x0;
  }

  decode(buffer) {
    super.decode(buffer);
    this.newId = buffer.readUInt32LE(0);
  }

  static get OPCODE() {
    return OPCODE;
  }
}

module.exports = IdChange;