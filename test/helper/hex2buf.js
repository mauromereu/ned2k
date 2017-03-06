const assert = require('assert');
const Buffer = require('buffer').Buffer;
const hex2buf = require('../../lib/helper/hex2buf');

describe('hex2buf', () => {
  it('#hex2buf', () => {
    const hexStr = '0102'.repeat(8);
    const buf = hex2buf(hexStr);
    const result = Buffer.from(hexStr.split(0).slice(1).map((v) => { return Number(v); }));
    assert.deepEqual(buf, result);
  });
});