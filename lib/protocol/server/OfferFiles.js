/**
 * should be sent on the following occasions:
 * 1. with full shared files list when connected to server
 * 2. with single file whenever new shared file is added
 * 3. as empty packet, keep alive server at regular intervals
 */
const Buffer = require('buffer').Buffer;
const UsualPacket = require('../UsualPacket');
const Tag = require('../tag/Tag');
const Constant = require('../../Constant');

const STABLE_SIZE = 4;
const FILE_STABLE_SIZE = 22;
const OPCODE = 0x15;

const CT = {
  FILENAME: 0X01,
  FILESIZE: 0X02,
  FILETYPE: 0x03
};

// it used to indicate whether 
// the file being shared is partial or complete;
const FL = {
  COMPLETE_ID: 0xfcfcfc,
  COMPLETE_PORT: 0xfcfc,
  PARTIAL_ID: 0xfbfbfb,
  PARTIAL_PORT: 0xfbfb
};

class OfferFiles extends UsualPacket {
  constructor(files) {
    super();
    this.files = files || [];
  }

  encode() {
    let count = this.files.length;
    let buf = Buffer.alloc(STABLE_SIZE);
    buf.writeUInt32LE(count);

    let arr = [];
    for (let i = 0; i < count; i++) {
      let fileItem = this.files[i];
      let fileBuf = Buffer.alloc(FILE_STABLE_SIZE);
      fileBuf.write(fileItem.hash || '', 0, 16);
      fileBuf.writeUInt32LE(fileItem.ip || 0x0, 16);
      fileBuf.writeUInt16LE(fileItem.port || 4662, 20);

      let tagList = Tag.encode2Buffer([
        { type: Tag.TYPE.TT_STRING, opcode: CT.FILENAME, data: fileItem.name || '' },
        { type: Tag.TYPE.TT_UINT32, opcode: CT.FILESIZE, data: fileItem.size || 0 },
        { type: Tag.TYPE.TT_STRING, opcode: CT.FILETYPE, data: fileItem.type || Constant.FILETYPE.ANY }
      ]);

      arr.push(Buffer.concat([fileBuf, tagList]));
    }

    buf = Buffer.concat([buf, Buffer.concat(arr)]);
    this.totalSize = buf.length;
    return buf;
  }

  static get OPCODE() {
    return OPCODE;
  }

  static get FILETYPE() {
    return Constant.FILETYPE;
  }

  static get FL() {
    return FL;
  }
}

module.exports = OfferFiles;