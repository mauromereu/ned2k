const Buffer = require('buffer').Buffer;
const UsualPacket = require('../../UsualPacket');
const Tag = require('../../tag/Tag');
const Constant = require('../../../Constant');
const hex2buf = require('../../../helper/hex2buf');

const STABLE_LENGTH = 22;
const OPCODE = 0x33;

const CT = {
  FILENAME: 0x01,
  FILESIZE: 0x02,
  FILETYPE: 0x03,
  SOURCES: 0x15,
  COMPLSRC: 0x30
};

class SearchResults extends UsualPacket {
  constructor(files = []) {
    super();
    this.files = files;
  }

  encode() {
    let buffer = Buffer.alloc(4);
    let count = this.files.length;
    buffer.writeUInt32LE(count, 0);

    let bufArr = [];
    for (let i = 0; i < count; i++) {
      let fileItem = this.files[i];
      let buffer = Buffer.alloc(STABLE_LENGTH);
      buffer.fill(hex2buf(fileItem.hash || ''), 0, 16);
      buffer.writeUInt32LE(fileItem.ip || 0x0, 16);
      buffer.writeUInt16LE(fileItem.port || 4662, 20);

      let tagList = Tag.encode2Buffer([
        { type: Tag.TYPE.TT_STRING, opcode: CT.FILENAME, data: fileItem.name || '' },
        { type: Tag.TYPE.TT_UINT32, opcode: CT.FILESIZE, data: fileItem.size || 0 },
        { type: Tag.TYPE.TT_STRING, opcode: CT.FILETYPE, data: fileItem.type || Constant.FILETYPE.ANY },
        { type: Tag.TYPE.TT_UINT32, opcode: CT.SOURCES, data: fileItem.sources || 0 },
        { type: Tag.TYPE.TT_UINT32, opcode: CT.COMPLSRC, data: fileItem.complsrc || 0 }
      ]);

      bufArr.push(Buffer.concat([buffer, tagList]));
    }

    buffer = Buffer.concat([buffer].concat(bufArr));
    this.totalSize = buffer.length;
    return buffer;
  }

  decode(buffer) {
    super.decode(buffer);
    this.files = [];
    let count = buffer.readUInt32LE(0);
    buffer = buffer.slice(4);

    for (let i = 0; i < count; i++) {
      let hash = buffer.toString('hex', 0, 16);
      let ip = buffer.readUInt32LE(16);
      let port = buffer.readUInt16LE(20);
      let tagList = Tag.decode2Tags(buffer.slice(STABLE_LENGTH));
      this.files.push({
        hash: hash,
        ip: ip,
        port: port,
        tagList: tagList
      });

      let tagsLen = tagList.reduce((t1, t2) => {
        return t1.totalSize + t2.totalSize;
      });

      // hash(16)+ip(4)+port(2)+tagCount(4)+tagsLen
      buffer = buffer.slice(STABLE_LENGTH + 4 + tagsLen);
    }
  }

  static get OPCODE() {
    return OPCODE;
  }

  static get FILETYPE() {
    return Constant.FILETYPE;
  }

  static get CT() {
    return CT;
  }
}

module.exports = SearchResults;