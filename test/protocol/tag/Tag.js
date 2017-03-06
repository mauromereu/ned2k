const assert = require('assert');
const Buffer = require('buffer').Buffer;
const Tag = require('../../../lib/protocol/tag/Tag');

describe('tag', () => {
  it('#encode uint8', () => {
    let tag = new Tag(Tag.TYPE.TT_UINT8, 0x01, 1);
    let buf = tag.encode();
    assert.deepEqual(buf, Buffer.from([Tag.TYPE.TT_UINT8, 0x01, 0x00, 0x01, 0x01]));
  });

  it('#encode uint16', () => {
    let tag = new Tag(Tag.TYPE.TT_UINT16, 0x01, 1);
    let buf = tag.encode();
    assert.deepEqual(buf, Buffer.from([Tag.TYPE.TT_UINT16, 0x01, 0x00, 0x01, 0x01, 0x00]));
  });

  it('#encode uint32', () => {
    let tag = new Tag(Tag.TYPE.TT_UINT32, 0x01, 1);
    let buf = tag.encode();
    assert.deepEqual(buf, Buffer.from([Tag.TYPE.TT_UINT32, 0x01, 0x00, 0x01, 0x01, 0x00, 0x00, 0x00]));
  });

  it('#encode string', () => {
    let tag = new Tag(Tag.TYPE.TT_STRING, 0x01, 'w');
    let buf = tag.encode();
    assert.deepEqual(buf, Buffer.from([Tag.TYPE.TT_STRING, 0x01, 0x00, 0x01, 0x01, 0x00, 0x77]));
  });
});