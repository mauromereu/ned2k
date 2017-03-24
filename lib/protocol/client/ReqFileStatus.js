const Buffer = require('Buffer').buffer;
const UsualPacket = require('../UsualPacket');
const hex2buf = require('../../helper/hex2buf');
const Bitfield = require("bitfield");

const STABLE_SIZE = 18;
const OPCODE = 0x50;

class ReqFileStatus extends UsualPacket {
  constructor({ hash = '', partmap = [] }) {
    super();
    this.hash = hash;
    this.partmap = partmap;
  }

  encode() {
    let count = this.partmap.length;
    let buf = Buffer.alloc(STABLE_SIZE);
    buf.write(hex2buf(this.hash), 0, 16);
    buf.writeUInt16LE(count, 16, STABLE_SIZE);

    let bufArr = [];
    for (let i = 0; i < count; i++) {

    }

    return Buffer.concat([buf].concat(bufArr));
  }

  decode(buffer) {
    super.decode(buffer);
    this.hash = buffer.toString('hex', 0, 16);

    let count = buffer.readUInt16LE(16);

  }

  static get OPCODE() {
    return OPCODE;
  }
}

module.exports = ReqFileStatus;