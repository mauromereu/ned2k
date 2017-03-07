const UsualPacket = require('../UsualPacket');

const OPCODE = 0x4C;

class HelloAnswer extends UsualPacket {
  constructor() {
    super();
  }

  encode() {

  }

  decode(buffer) {

  }

  static get OPCODE() {
    return OPCODE;
  }
}