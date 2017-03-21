const assert = require('assert');
const Buffer = require('buffer').Buffer;

module.exports = function(hex) {
  let bufArr = [];
  for (let i = 0, len = hex.length; i < len; i += 2) {
    bufArr.push(Number('0x' + hex[i] + hex[i + 1]));
  }

  // when fill empty Buffer, Buffer.fill will loop forever
  return Buffer.from(bufArr.length ? bufArr : [0x00]);
};