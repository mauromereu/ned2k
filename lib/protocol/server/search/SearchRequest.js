const Buffer = require('buffer').Buffer;
const UsualPacket = require('../../UsualPacket');
const SearchString = require('./SearchString');
const Constant = require('../../../Constant');

const OPCODE = 0x16;

const RELATION = {
  AND: 0x00,
  OR: 0x01,
  NOT: 0x02
};

const PARAMETER = {
  STRING: 0x01,
  TYPE: 0x02,
  NUMBER: 0x03
};

const NEMONIC = {
  TYPE: Buffer.from([0x01, 0x00, 0x03]),
  MINSIZE: Buffer.from([0x01, 0x01, 0x00, 0x02]),
  MAXSIZE: Buffer.from([0x02, 0x01, 0x00, 0x02]),
  AVAIBILITY: Buffer.from([0x01, 0x01, 0x00, 0x15]),
  EXT: Buffer.from([0x01, 0x00, 0x04])
};

class SearchRequest extends UsualPacket {
  constructor({
    originString,
    type = Constant.FILETYPE.ANY,
    minSize = 0x00, // byte
    maxSize = 0x00, // byte
    sourceNum = 0x00,
    ext = ''
  }) {
    super();
    this.searchString = new SearchString(originString);
    this.type = type;
    this.minSize = minSize;
    this.maxSize = maxSize;
    this.sourceNum = sourceNum;
    this.ext = ext;
  }

  encode() {
    let bufArr = [];
    let buf = null;
    let byteLen = 0;

    // write search string
    let infixStrExps = this.searchString.printFormatedString().split(' ');
    for (let i = 0, len = infixStrExps.length; i < len; i++) {
      let infixStr = infixStrExps[i];
      buf = Buffer.alloc(2);
      switch (infixStr) {
        case 'AND':
          buf.writeUInt16BE(RELATION.AND);
          break;
        case 'OR':
          buf.writeUInt16BE(RELATION.OR);
          break;
        case 'NOT':
          buf.writeUInt16BE(RELATION.NOT);
          break;
        default:
          byteLen = Buffer.byteLength(infixStr);
          buf = Buffer.alloc(3 + byteLen);
          buf.writeUInt8(PARAMETER.STRING, 0);
          buf.writeUInt16LE(byteLen, 1);
          buf.write(infixStr, 3);
      }
      bufArr.push(buf);
    }

    // type is always write
    bufArr.unshift(Buffer.from([0x00, 0x00]));
    byteLen = Buffer.byteLength(this.type);
    buf = Buffer.alloc(3 + byteLen + 3);
    buf.writeUInt8(PARAMETER.TYPE, 0);
    buf.writeUInt16LE(byteLen, 1);
    buf.write(this.type, 3);
    buf.fill(NEMONIC.TYPE, 3 + byteLen);
    bufArr.push(buf);

    // and min size
    if (this.minSize > 0) {
      bufArr.unshift(Buffer.from([0x00, 0x00]));
      buf = Buffer.alloc(9);
      buf.writeUInt8(PARAMETER.NUMBER, 0);
      buf.writeUInt32LE(this.minSize, 1);
      buf.fill(NEMONIC.MINSIZE, 5);
      bufArr.push(buf);
    }

    // and max size
    if (this.maxSize > 0) {
      bufArr.unshift(Buffer.from([0x00, 0x00]));
      buf = Buffer.alloc(9);
      buf.writeUInt8(PARAMETER.NUMBER, 0);
      buf.writeUInt32LE(this.maxSize, 1);
      buf.fill(NEMONIC.MAXSIZE, 5);
      bufArr.push(buf);
    }

    // and source number
    if (this.sourceNum > 0) {
      bufArr.unshift(Buffer.from([0x00, 0x00]));
      buf = Buffer.alloc(9);
      buf.writeUInt8(PARAMETER.NUMBER, 0);
      buf.writeUInt32LE(this.sourceNum, 1);
      buf.fill(NEMONIC.AVAIBILITY, 5);
      bufArr.push(buf);
    }

    // and ext
    if (this.ext) {
      bufArr.unshift(Buffer.from([0x00, 0x00]));
      byteLen = Buffer.byteLength(this.ext);
      buf = Buffer.alloc(3 + byteLen + 3);
      buf.writeUInt8(PARAMETER.STRING, 0);
      buf.writeUInt16LE(byteLen, 1);
      buf.write(this.ext, 3);
      buf.fill(NEMONIC.EXT, 3 + byteLen);
      bufArr.push(buf);
    }

    buf = Buffer.concat(bufArr);
    this.totalSize = buf.length;
    return buf;
  }

  static get OPCODE() {
    return OPCODE;
  }

  static get FILETYPE() {
    return Constant.FILETYPE;
  }
}

module.exports = SearchRequest;