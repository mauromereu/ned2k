const assert = require('assert');
const Hello = require('../../../lib/protocol/client/Hello');
const Session = require('../../../lib/Session');

describe('Hello Packet', () => {
  it('#encode', () => {
    let session = new Session({ serverIp: 0x0, serverPort: 4662 });
    let hello = new Hello(session);
    let buf = hello.encode();
    assert(buf.readUInt8(0) == 16);
  });

  it('#decode', () => {
    let session = new Session({ serverIp: 0x0, serverPort: 4662 });
    let hello = new Hello(session);
    let buf = hello.encode();

    hello = new Hello();
    hello.decode(buf);
    assert(hello.userHashLength == 16);
  });
});