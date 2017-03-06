const assert = require('assert');
const Buffer = require('buffer').Buffer;
const IdChange = require('../../../lib/protocol/server/IdChange');

describe('id change packet', () => {
  it('#decode', () => {
    let idChange = new IdChange();
    let buf = Buffer.alloc(4);
    buf.writeUInt32LE(110, 0);
    idChange.decode(buf);
    assert(idChange.newId == 110);
  })
});