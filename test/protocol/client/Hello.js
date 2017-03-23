const assert = require('assert');
const Hello = require('../../../lib/protocol/client/Hello');
const Session = require('../../../lib/Session');
const Tag = require('../../../lib/protocol/tag/Tag');
const Constant = require('../../../lib/Constant');

describe('Hello Packet', () => {
  it('#encode', () => {
    let session = new Session({ serverIp: 0x0, serverPort: 4662 });
    let hello = new Hello(session);
    let buf = hello.encode();

    assert(buf.toString('hex', 0, 16) == session.userHash);
    assert(buf.readUInt32LE(16) == session.clientId);
    assert(buf.readUInt16LE(20) == session.tcpPort);

    let tagBuf = buf.slice(22);
    let tagList = Tag.decode2Tags(tagBuf);
    assert(tagList[0].type == Tag.TYPE.TT_STRING && tagList[0].data == session.nickname);
    assert(tagList[1].type == Tag.TYPE.TT_UINT16 && tagList[1].data == session.tcpPort);
    assert(tagList[2].type == Tag.TYPE.TT_UINT32 && tagList[2].data == Constant.APP_VERSION);
    assert(tagList[3].type == Tag.TYPE.TT_STRING && tagList[3].data == Constant.MODSTR);
    assert(tagList[4].type == Tag.TYPE.TT_UINT32 && tagList[4].data == 0);
    assert(tagList[5].type == Tag.TYPE.TT_UINT32 && tagList[5].data != 0);
  });

  it('#decode', () => {
    let session = new Session({ serverIp: 0x0, serverPort: 4662 });
    let hello = new Hello(session);
    let buf = hello.encode();

    hello = new Hello();
    hello.decode(buf);

    assert(hello.userHash == session.userHash);
    assert(hello.clientId == session.clientId);
    assert(hello.tcpPort == session.tcpPort);

    let tagList = hello.tagList;
    assert(tagList[0].type == Tag.TYPE.TT_STRING && tagList[0].data == session.nickname);
    assert(tagList[1].type == Tag.TYPE.TT_UINT16 && tagList[1].data == session.tcpPort);
    assert(tagList[2].type == Tag.TYPE.TT_UINT32 && tagList[2].data == Constant.APP_VERSION);
    assert(tagList[3].type == Tag.TYPE.TT_STRING && tagList[3].data == Constant.MODSTR);
    assert(tagList[4].type == Tag.TYPE.TT_UINT32 && tagList[4].data == 0);
    assert(tagList[5].type == Tag.TYPE.TT_UINT32 && tagList[5].data != 0);
  });
});