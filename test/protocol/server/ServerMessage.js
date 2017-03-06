const assert = require('assert');
const Buffer = require('buffer').Buffer;
const ServerMessage = require('../../../lib/protocol/server/ServerMessage');

describe('server message packet', () => {
  it('#decode', () => {
    let serverMsg = new ServerMessage();
    let buf = Buffer.alloc(5);
    buf.writeUInt16LE(3);
    buf.write('abc', 2);
    serverMsg.decode(buf);
    assert(serverMsg.length == 3 && serverMsg.message == 'abc');
  });
});