const assert = require('assert');
const Buffer = require('buffer').Buffer;
const ServerStatus = require('../../../lib/protocol/server/ServerStatus');

describe('server status packet', () => {
  it('#decode', () => {
    let serverStatus = new ServerStatus();
    let buf = Buffer.alloc(8);
    buf.writeUInt32LE(2, 0);
    buf.writeUInt32LE(4, 4);
    serverStatus.decode(buf);
    assert(serverStatus.users == 2 && serverStatus.files == 4);
  })
});