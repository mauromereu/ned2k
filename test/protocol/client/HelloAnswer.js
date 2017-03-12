const assert = require('assert');
const Session = require('../../../lib/Session');
const HelloAnswer = require('../../../lib/protocol/client/HelloAnswer');
const hex2buf = require('../../../lib/helper/hex2buf');
const Tag = require('../../../lib/protocol/tag/Tag');
const Constant = require('../../../lib/Constant');

describe('HelloAnswer Packet', () => {
  it('#encode', () => {
    let session = new Session();
    let helloAnswer = new HelloAnswer(session);
    let buf = helloAnswer.encode();

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
    let session = new Session();
    let helloAnswer = new HelloAnswer(session);
    let buf = helloAnswer.encode();

    helloAnswer = new HelloAnswer();
    helloAnswer.decode(buf);
    assert(helloAnswer.userHash == session.userHash);
    assert(helloAnswer.clientId == session.clientId);
    assert(helloAnswer.tcpPort == session.tcpPort);

    let tagList = helloAnswer.tagList;
    assert(tagList[0].type == Tag.TYPE.TT_STRING && tagList[0].data == session.nickname);
    assert(tagList[1].type == Tag.TYPE.TT_UINT16 && tagList[1].data == session.tcpPort);
    assert(tagList[2].type == Tag.TYPE.TT_UINT32 && tagList[2].data == Constant.APP_VERSION);
    assert(tagList[3].type == Tag.TYPE.TT_STRING && tagList[3].data == Constant.MODSTR);
    assert(tagList[4].type == Tag.TYPE.TT_UINT32 && tagList[4].data == 0);
    assert(tagList[5].type == Tag.TYPE.TT_UINT32 && tagList[5].data != 0);

  });
});