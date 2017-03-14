const UsualPacket = require('../UsualPacket');

const OPCODE = 0x38;

class ServerMessage extends UsualPacket {
  constructor() {
    super();
    this.length = 0x0;
    this.message = '';
  }

  decode(buffer) {
    super.decode(buffer);
    this.length = buffer.readUInt16LE(0);
    this.message = buffer.toString('utf-8', 2, 2 + this.length);
  }

  static get OPCODE() {
    return OPCODE;
  }
}

module.exports = ServerMessage;