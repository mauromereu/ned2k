const Buffer = require('buffer').Buffer;
const UsualPacket = require('../UsualPacket');
const hex2buf = require('../../helper/hex2buf');

const STABLE_LENGTH = 20;
const OPCODE = 0x59;

class FileName extends UsualPacket {
  constructor({ hash, name } = { hash: '', name: '' }) {
    super();
    this.hash = hash;
    this.name = name;
  }

  encode() {
    let byteLen = Buffer.byteLength(this.name);
    let buffer = Buffer.alloc(STABLE_LENGTH + byteLen);
    buffer.fill(hex2buf(this.hash), 0, 16);
    buffer.writeUInt32LE(byteLen, 16);
    buffer.write(this.name, STABLE_LENGTH);
    return buffer;
  }

  decode(buffer) {
    super.decode(buffer);
    this.hash = buffer.toString('hex', 0, 16);
    this.name = buffer.toString('utf-8', STABLE_LENGTH, STABLE_LENGTH + buffer.readUInt32LE(16));
  }

  static get OPCODE() {
    return OPCODE;
  }
}

module.exports = FileName;