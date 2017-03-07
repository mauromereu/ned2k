const UsualPacket = require('../UsualPacket');

const OPCODE = 0x01;

class Hello extends UsualPacket {
  constructor(session) {
    super();
    this._session = session;
    this._tagList = {};
  }

  encode() {

  }

  decode(buffer) {

  }

  static get OPCODE() {
    return OPCODE;
  }
}

module.exports = Hello;