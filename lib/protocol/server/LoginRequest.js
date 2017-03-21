const UsualPacket = require('../UsualPacket');
const Buffer = require('buffer').Buffer;
const hex2buf = require('../../helper/hex2buf');
const Tag = require('../tag/Tag');
const Constant = require('../../Constant');

const STABLE_SIZE = 22;

const VERSION = { // dont mind it, you can think it like 0.1.0.0 instead
  MAJOR: 0,
  MINOR: 1,
  TINY: 0
};

const FL = {
  ZLIB: 0x01, // zlib support
  IPINLOGIN: 0x02, // client sends it own ip during login
  AUXPORT: 0x04, // unknown
  NEWTAGS: 0x08, // support for new style emule tags
  UNICODE: 0x10 // unicode support
}

const CT = {
  NICK: 0X01,
  VERSION: 0X11,
  PORT: 0x0f,
  MULEVERSION: 0xfb,
  FLAGS: 0x20
}

const MULE_VERSION = VERSION.MAJOR << 24 | VERSION.MINOR << 17 | VERSION.TINY << 10 | 1 << 7;
const CAP = FL.AUXPORT | FL.UNICODE;

const OPCODE = 0x01;

class LoginRequest extends UsualPacket {
  constructor({
    nickname,
    userHash,
    clientId,
    tcpPort
  }) {
    super();
    this.nickname = nickname;
    this.userHash = userHash;
    this.clientId = clientId;
    this.tcpPort = tcpPort;
  }

  encode() {
    super.encode();
    let { nickname, userHash, clientId, tcpPort } = this;
    let buf = Buffer.alloc(STABLE_SIZE);

    buf.fill(hex2buf(userHash), 0, 16);
    buf.writeUInt32LE(clientId, 16);
    buf.writeUInt16LE(tcpPort, 20);

    let tagList = Tag.encode2Buffer([
      { type: Tag.TYPE.TT_STRING, opcode: CT.NICK, data: nickname },
      { type: Tag.TYPE.TT_UINT8, opcode: CT.VERSION, data: Constant.APP_VERSION },
      { type: Tag.TYPE.TT_UINT16, opcode: CT.PORT, data: tcpPort },
      { type: Tag.TYPE.TT_UINT32, opcode: CT.MULEVERSION, data: MULE_VERSION },
      { type: Tag.TYPE.TT_UINT8, opcode: CT.FLAGS, data: CAP }
    ]);

    buf = Buffer.concat([buf, tagList]);
    this.totalSize = buf.length;

    return buf;
  }

  static get OPCODE() {
    return OPCODE;
  }
}

module.exports = LoginRequest;