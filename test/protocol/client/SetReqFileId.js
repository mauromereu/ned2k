const assert = require('assert');
const SetReqFileId = require('../../../lib/protocol/client/SetReqFileId');

describe('set request file id packet', () => {
  let hash = '01020304050607080910111213141516';
  it('#encode', () => {
    let setReqFileId = new SetReqFileId(hash);
    let buf = setReqFileId.encode();
    assert.deepEqual(buf, [
      0x01, 0x02, 0x03, 0x04,
      0x05, 0x06, 0x07, 0x08,
      0x09, 0x10, 0x11, 0x12,
      0x13, 0x14, 0x15, 0x16
    ]);
  });

  it('#decode', () => {
    let setReqFileId = new SetReqFileId(hash);
    let buf = setReqFileId.encode();

    setReqFileId = new SetReqFileId();
    setReqFileId.decode(buf);
    assert(setReqFileId.hash == hash);
  });
});