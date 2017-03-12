const assert = require('assert');
const Buffer = require('buffer').Buffer;
const Session = require('../../../lib/Session');
const LoginReqPacket = require('../../../lib/protocol/server/LoginRequest');
const hex2buf = require('../../../lib/helper/hex2buf');

describe('login request packet', () => {
  it('#encode', () => {
    let session = new Session();
    let loginReq = new LoginReqPacket(session);
    let buf = loginReq.encode();

    assert.deepEqual(buf.slice(0, 16), hex2buf(session.userHash));
    assert.deepEqual(buf.readUInt32LE(16), session.clientId);
    assert.deepEqual(buf.readUInt16LE(20), session.tcpPort);
  });
});