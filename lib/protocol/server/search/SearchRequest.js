const Buffer = require('buffer').Buffer;
const UsualPacket = require('../UsualPacket');
const SearchString = require('./SearchString');

const OPCODE = 0X0;

const RELATION = {
  AND: 0x00,
  OR: 0X01,
  NOT: 0X02
};

const SEARCH_TYPE = {
  ANY: 0x0,
};

class SearchRequest extends UsualPacket {
  constructor({
    originString,
    type = SEARCH_TYPE.ANY,
    minSize = 0x00,
    maxSize = 0xffffffff,
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

    // write search string
    let infixStrExps = this.searchString.formatSearchString().split(' ');
    for (let i = 0, len = infixStrExps.length; i < len; i++) {
      let infixStr = infixStrExps[i];
      let buf = Buffer.alloc(2);
      switch (infixStr) {
        case RELATION.AND:
          buf.writeUInt16BE(RELATION.AND);
          break;
        case RELATION.OR:
          buf.writeUInt16BE(RELATION.OR);
          break;
        case RELATION.NOT:
          buf.writeUInt16BE(RELATION.NOT);
          break;
        default:
          let byteLen = Buffer.byteLength(infixStr);
          buf = Buffer.alloc(3 + byteLen);
          buf.writeUInt8(0x01, 0);
          buf.writeUInt16LE(byteLen, 1);
          buf.write(infixStr, 3);
      }
      bufArr.push(buf);
    }

    // type write

    let buf = Buffer.concat(bufArr);
    this.totalSize = buf.length;
    return buf;
  }

  static get OPCODE() {
    return OPCODE;
  }

  static get SEARCH_TYPE() {
    return SEARCH_TYPE;
  }
}

module.exports = SearchRequest;