const assert = require('assert');
const Buffer = require('buffer').Buffer;
const HeaderPacket = require('../../lib/protocol/Header');

describe('header packet', () => {
  let header = null;
  let buf = null;
  beforeEach(() => {
    header = new HeaderPacket();
    header.size = 16;
    buf = Buffer.from([0xe3, 0x10, 0x0, 0x0, 0x0, 0x01]);
  });

  it('#encode', () => {
    assert.deepEqual(header.encode(), buf);
  });

  it('#decode', () => {
    header.decode(buf);
    assert(
      header.protocol == 0xe3 &&
      header.size == 16 &&
      header.optype == 0x01
    );
  });

  it('#totalSize', () => {
    assert(header.totalSize == 6);
  });
});