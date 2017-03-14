class UsualPacket {
  constructor() {
    this.totalSize = 0;
  }

  encode() {

  }

  decode(buffer) {
    this.totalSize = buffer.length;
  }

  static get OPCODE() {
    return 0x0;
  }
}

module.exports = UsualPacket;