const assert = require('assert');
const Buffer = require('buffer').Buffer;

module.exports = function(hex) {
  assert(hex.length % 2 == 0, `hex string uncorrect: ${hex}`);
  let bufArr = [];
  for (let i = 0, len = hex.length; i < len; i += 2) {
    bufArr.push(Number('0x' + hex[i] + hex[i + 1]));
  }
  return Buffer.from(bufArr);
};