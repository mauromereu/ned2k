const assert = require('assert');
const combinePacket = require('../../lib/helper/combinePackets');
const Session = require('../../lib/Session');
const HeaderPacket = require('../../lib/protocol/Header');
const LoginReqPacket = require('../../lib/protocol/server/LoginRequest');

describe('combinePacket', () => {
  it('#combinePacket', () => {
    let header = new HeaderPacket();
    let loginReq = new LoginReqPacket(new Session());
    let buf = combinePacket(header, loginReq);
    assert(buf.readUInt32LE(1), header.size);
  });
});