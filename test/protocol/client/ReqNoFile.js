const assert = require('assert');
const ReqNoFile = require('../../../lib/protocol/client/ReqNoFile');

describe('request no file packet', () => {
  let hash = '01020304050607080910111213141516';
  it('#encode', () => {
    let reqNoFile = new ReqNoFile(hash);
    let buf = reqNoFile.encode();
    assert.deepEqual(buf, [
      0x01, 0x02, 0x03, 0x04,
      0x05, 0x06, 0x07, 0x08,
      0x09, 0x10, 0x11, 0x12,
      0x13, 0x14, 0x15, 0x16
    ]);
  });

  it('#decode', () => {
    let reqNoFile = new ReqNoFile(hash);
    let buf = reqNoFile.encode();

    reqNoFile = new ReqNoFile();
    reqNoFile.decode(buf);
    assert(reqNoFile.hash == hash);
  });
});