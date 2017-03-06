const UsualPacket = require('../UsualPacket');
const Buffer = require('buffer').Buffer;
const hex2buf = require('../../helper/hex2buf');
const Tag = require('../tag/Tag');

const STABLE_SIZE = 26;

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
  FLAGS: 0X20
}

const VERSION_TAG = 0x3c;
const MULE_VERSION = VERSION.MAJOR << 24 | VERSION.MINOR << 17 | VERSION.TINY << 10 | 1 << 7;
const CAP = FL.ZLIB | FL.IPINLOGIN | FL.AUXPORT | FL.NEWTAGS | FL.UNICODE;

const OPCODE = 0x01;

class LoginRequest extends UsualPacket {
  constructor(session) {
    super();
    this._session = session;
  }

  encode() {
    let { nickname, userHash, clientId, tcpPort } = this._session;
    let buf = Buffer.alloc(STABLE_SIZE);

    buf.fill(hex2buf(userHash), 0, 16);
    buf.writeUInt32LE(clientId, 16);
    buf.writeUInt16LE(tcpPort, 20);
    buf.writeUInt32LE(4, 22);

    let arr = [];
    let tag = new Tag(Tag.TYPE.TT_STRING, CT.NICK, nickname);
    arr.push(tag.encode());

    tag = new Tag(Tag.TYPE.TT_UINT8, CT.VERSION, VERSION_TAG);
    arr.push(tag.encode());

    tag = new Tag(Tag.TYPE.TT_UINT16, CT.PORT, tcpPort);
    arr.push(tag.encode());

    tag = new Tag(Tag.TYPE.TT_UINT32, CT.MULEVERSION, MULE_VERSION);
    arr.push(tag.encode());

    tag = new Tag(Tag.TYPE.TT_UINT8, CT.FLAGS, CAP);
    arr.push(tag.encode());

    buf = Buffer.concat([buf].concat(arr));
    this.totalSize = buf.length;

    return buf;
  }

  static get OPCODE() {
    return OPCODE;
  }
}

module.exports = LoginRequest;