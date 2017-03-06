const UsualPacket = require('../UsualPacket');

const OPCODE = 0x38;

class ServerMessage extends UsualPacket {
  constructor() {
    super();
    this.length = 0x0;
    this.message = '';
  }

  decode(buf) {
    this.length = buf.readUInt16LE(0);
    this.message = buf.slice(2, 2 + this.length).toString('utf-8');
  }

  static get OPCODE() {
    return OPCODE;
  }
}

module.exports = ServerMessage;