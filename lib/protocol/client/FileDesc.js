const Buffer = require('buffer').Buffer;
const UsualPacket = require('../UsualPacket');

const STABLE_LENGTH = 5;
const OPCODE = 0x61;

class FileDesc extends UsualPacket {
  constructor({ rating = 0x0, comment = '' }) {
    super();
    this.rating = rating;
    this.comment = comment;
  }

  encode() {
    let byteLen = Buffer.byteLength(this.comment);
    let buffer = Buffer.alloc(STABLE_LENGTH + byteLen);
    buffer.writeUInt8(this.rating, 0);
    buffer.writeInt32LE(byteLen, 1);
    buffer.write(this.comment, STABLE_LENGTH);
  }

  decode(buffer) {
    super.decode(buffer);
    this.rating = buffer.readUInt8(0);
    this.comment = buffer.toString('utf-8', STABLE_LENGTH, STABLE_LENGTH + buffer.readUInt32LE(1));
  }

  static get OPCODE() {
    return OPCODE;
  }
}