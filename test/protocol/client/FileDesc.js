const assert = require('assert');
const FileDesc = require('../../../lib/protocol/client/FileDesc');

describe('file desc packet', () => {
  let rating = 0x01;
  let comment = 'comment';

  it('#encode', () => {
    let fileDesc = new FileDesc({ rating: rating, comment: comment });
    let buf = fileDesc.encode();
    assert.deepEqual(buf, [
      0x01,
      0x07, 0x00, 0x00, 0x00,
      0x63, 0x6f, 0x6d, 0x6d,
      0x65, 0x6e, 0x74
    ]);
  });

  it('#decode', () => {
    let fileDesc = new FileDesc({ rating: rating, comment: comment });
    let buf = fileDesc.encode();

    fileDesc = new FileDesc();
    fileDesc.decode(buf);

    assert(fileDesc.rating == rating);
    assert(fileDesc.comment == comment);
  });
});