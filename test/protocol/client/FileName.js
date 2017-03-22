const assert = require('assert');
const FileName = require('../../../lib/protocol/client/FileName');

describe('file name packet', () => {
  let hash = '';
  let name = 'filename';
  beforeEach(() => {
    hash = '01000000000000000000000000000000';
  })

  it('#encode', () => {
    let fileName = new FileName({ hash: hash, name: name });
    let buf = fileName.encode();
    assert.deepEqual(buf, [
      0x01, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x08, 0x00, 0x00, 0x00,
      0x66, 0x69, 0x6c, 0x65,
      0x6e, 0x61, 0x6d, 0x65
    ]);
  });

  it('#decode', () => {
    let fileName = new FileName({ hash: hash, name: name });
    let buf = fileName.encode();

    fileName = new FileName();
    fileName.decode(buf);

    assert(fileName.hash == hash);
    assert(fileName.name == name);
  });
});