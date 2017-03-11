/**
 * +--------+--------+--------+--------+--------
 * |  type  |  length = 0x01  | opcode |   type-specific amount of data
 * +--------+--------+--------+--------+--------
 */

const assert = require('assert');
const Buffer = require('buffer').Buffer;

const TYPE = {
  TT_UNDEFINED: 0x00, // special tag definition for empty objects
  TT_HASH: 0x01, // unsupported, 16 bytes
  TT_STRING: 0x02, // [u16]len[len]data
  TT_UINT32: 0x03, // 4 bytes
  TT_FLOAT: 0x04, // 4 bytes
  TT_BOOL: 0x05, // unsupported, 1 bytes
  TT_BOOLARR: 0x06, // unsupported [u16]len[len]data
  TT_BLOB: 0x07, // unsupported, [u16]len[len]data
  TT_UINT16: 0x08, // 2 bytes
  TT_UINT8: 0x09, // 1 bytes
  TT_BSOB: 0x0a // unsupported, [u16]len[len]data
}


class Tag {
  constructor(type, opcode, data) {
    this.type = type;
    this.opcode = opcode;
    this.data = data;
    this.totalSize = 4;
  }

  // standard ed2k tag, not contain lugdunum
  encode() {
    assert(this.data != null, 'data cant be null');
    let bodyBuf = null;
    switch (this.type) {
      case TYPE.TT_STRING:
        bodyBuf = this._encodeString();
        break;
      case TYPE.TT_UINT32:
        bodyBuf = this._encodeUInt32LE();
        break;
      case TYPE.TT_FLOAT:
        bodyBuf = this._encodeFloat();
        break;
      case TYPE.TT_UINT16:
        bodyBuf = this._encodeUInt16LE();
        break;
      case TYPE.TT_UINT8:
        bodyBuf = this._encodeUInt8();
        break;
    }

    this.totalSize += bodyBuf.length;

    let headerBuf = Buffer.alloc(4);
    headerBuf.writeUInt8(this.type, 0);
    headerBuf.writeUInt16LE(0x01, 1);
    headerBuf.writeUInt8(this.opcode, 3);

    return Buffer.concat([headerBuf, bodyBuf]);
  }

  static decode2Tags(buffer) {
    // need to do...
  }

  static get TYPE() {
    return TYPE;
  }

  _encodeUInt8() {
    let buf = Buffer.alloc(1);
    buf.writeUInt8(this.data);
    return buf;
  }

  _encodeUInt16LE() {
    let buf = Buffer.alloc(2);
    buf.writeUInt16LE(this.data);
    return buf;
  }

  _encodeUInt32LE() {
    let buf = Buffer.alloc(4);
    buf.writeUInt32LE(this.data);
    return buf;
  }

  _encodeFloat() {
    let buf = Buffer.alloc(4);
    buf.writeFloatLE(this.data);
    return buf;
  }

  _encodeString() {
    let byteLen = Buffer.byteLength(this.data);
    let buf = Buffer.alloc(2 + byteLen);
    buf.writeUInt16LE(byteLen, 0);
    buf.write(this.data, 2);
    return buf;
  }
}

module.exports = Tag;