const UsualPacket = require('../UsualPacket');

const OPCODE = 0x34;

class ServerStatus extends UsualPacket {
  constructor() {
    super();
    this.users = 0x0;
    this.files = 0x0;
  }

  decode(buffer) {
    super.decode(buffer);
    this.users = buffer.readUInt32LE(0);
    this.files = buffer.readUInt32LE(4);
  }

  static get OPCODE() {
    return OPCODE;
  }
}

module.exports = ServerStatus;