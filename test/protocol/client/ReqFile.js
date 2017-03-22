const assert = require('assert');
const ReqFile = require('../../../lib/protocol/client/ReqFile');

describe('req file packet', () => {
  let hash = '';
  beforeEach(() => {
    hash = '01000000000000000000000000000000';
  })

  it('#encode', () => {
    let reqFile = new ReqFile(hash);
    let buf = reqFile.encode();
    assert.deepEqual(buf, [
      0x01, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00
    ]);
  });

  it('#decode', () => {
    let reqFile = new ReqFile(hash);
    let buf = reqFile.encode();

    reqFile = new ReqFile();
    reqFile.decode(buf);
    assert(reqFile.hash == hash);
  });
});