const assert = require('assert');
const Buffer = require('buffer').Buffer;

module.exports = function(header, body) {
  assert(header && body, 'header and body cant be null');

  // we call encode first to prevent cant get totalSize prop
  let bodyBuf = body.encode();
  header.size = body.totalSize + 1;
  return Buffer.concat([header.encode(), bodyBuf]);
};