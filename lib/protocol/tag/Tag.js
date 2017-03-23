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

const STABLE_SIZE = 4;

const PARSE_TYPE_STATE = 0;
const PARSE_LENGTH_STATE = 1;
const PARSE_OPCODE_STATE = 2;
const PARSE_DATA_STATE = 3;


class Tag {
  constructor({ type = TYPE.TT_UNDEFINED, opcode = 0x01, data = 0x00 }) {
    this.type = type;
    this.opcode = opcode;
    this.data = data;
    this.totalSize = STABLE_SIZE;
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

  static encode2Buffer(tags) {
    let buf = Buffer.alloc(4);
    buf.writeUInt32LE(tags.length || 0);

    let arr = [];
    for (let i = 0, len = tags.length; i < len; i++) {
      let tag = new Tag(tags[i]);
      arr.push(tag.encode());
    }

    return Buffer.concat([buf, Buffer.concat(arr)]);
  }

  static decode2Tags(buffer) {
    let tags = [];
    let state = PARSE_TYPE_STATE;
    let type = TYPE.TT_UNDEFINED;
    let length = 0x01;
    let opcode = 0x0;
    let data = null;
    let dataLength = 0;
    let tagSize = buffer.readUInt32LE(0);
    let i = 0;
    buffer = buffer.slice(4);

    while (true) {
      // ignore less than stable length package
      if (state == PARSE_TYPE_STATE && (i++ >= tagSize || Buffer.byteLength(buffer) < STABLE_SIZE)) {
        break;
      }

      switch (state) {
        case PARSE_TYPE_STATE:
          type = buffer.readUInt8(0);
          state = PARSE_LENGTH_STATE;
          break;
        case PARSE_LENGTH_STATE:
          length = buffer.readUInt16LE(1);
          state = PARSE_OPCODE_STATE;
          break;
        case PARSE_OPCODE_STATE:
          opcode = buffer.readUInt8(3);
          buffer = buffer.slice(STABLE_SIZE);
          state = PARSE_DATA_STATE;
          break;
        case PARSE_DATA_STATE:
          [data, dataLength] = this._typeDecode(type, buffer);
          buffer = buffer.slice(dataLength);

          let tag = new Tag({ type, opcode, data });
          tag.totalSize += dataLength;
          tags.push(tag);

          state = PARSE_TYPE_STATE;
          break;
      }
    }

    return tags;
  }

  static toKVObject(tags, CTMap) {
    let kv = {};
    let keymap = {};
    for (let key in CTMap) {
      keymap[CTMap[key]] = key.toLowerCase();
    }

    for (let i = 0, len = tags.length; i < len; i++) {
      let tag = tags[i];
      if (keymap[tag.opcode]) {
        kv[keymap[tag.opcode]] = tag.data;
      }
    }

    return kv;
  }

  static _typeDecode(type, buffer) {
    let data = null;
    let dataLength = 0;

    switch (type) {
      case TYPE.TT_STRING:
        dataLength = buffer.readUInt16LE(0);
        data = buffer.toString('utf-8', 2, 2 + dataLength);
        dataLength += 2;
        break;
      case TYPE.TT_UINT32:
        dataLength = 4;
        data = buffer.readUInt32LE(0);
        break;
      case TYPE.TT_FLOAT:
        dataLength = 4;
        data = buffer.readFloatLE(0);
        break;
      case TYPE.TT_UINT16:
        dataLength = 2;
        data = buffer.readUInt16LE(0);
        break;
      case TYPE.TT_UINT8:
        dataLength = 1;
        data = buffer.readUInt8(0);
        break;
    }

    return [data, dataLength];
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