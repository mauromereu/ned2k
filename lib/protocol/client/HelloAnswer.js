const Buffer = require('buffer').Buffer;
const UsualPacket = require('../UsualPacket');
const Tag = require('../tag/Tag');
const Constant = require('../../Constant');
const MicOptions = require('./MicOptions');
const hex2buf = require('../../helper/hex2buf');

const OPCODE = 0x4c;
const STABLE_SIZE = 22;
const CT = {
  NICK: 0x01,
  PORT: 0x0f,
  MULEVERSION: 0xfb,
  MODSTR: 0x55,
  UDPPORTS: 0xf9,
  MISCFEATURES: 0xfa
};

class HelloAnswer extends UsualPacket {
  constructor({ compressVersion, nickname, userHash, clientId, tcpPort } = {}) {
    super();
    this.compressVersion = compressVersion || 0;
    this.nickname = nickname || '';
    this.userHash = userHash;
    this.clientId = clientId;
    this.tcpPort = tcpPort;
    this.tagList = {};
    this.totalSize = 0;
  }

  encode() {
    let { compressVersion, nickname, userHash, clientId, tcpPort } = this;
    let buf = Buffer.alloc(STABLE_SIZE);
    buf.fill(hex2buf(userHash), 0, 16);
    buf.writeUInt32LE(clientId, 16);
    buf.writeUInt16LE(tcpPort, 20);

    let micOptions = new MicOptions();
    micOptions.unicodeSupport = 1;
    micOptions.dataCompVer = compressVersion;
    micOptions.noViewSharedFiles = 1;
    micOptions.sourceExchange1Ver = 0;

    let tagList = Tag.encode2Buffer([
      { type: Tag.TYPE.TT_STRING, opcode: CT.NICK, data: nickname },
      { type: Tag.TYPE.TT_UINT16, opcode: CT.PORT, data: tcpPort },
      { type: Tag.TYPE.TT_UINT32, opcode: CT.MULEVERSION, data: Constant.APP_VERSION },
      { type: Tag.TYPE.TT_STRING, opcode: CT.MODSTR, data: Constant.MODSTR },
      { type: Tag.TYPE.TT_UINT32, opcode: CT.UDPPORTS, data: 0 },
      { type: Tag.TYPE.TT_UINT32, opcode: CT.MISCFEATURES, data: micOptions.intValue() }
    ]);

    buf = Buffer.concat([buf, tagList]);
    this.totalSize = buf.length;

    return buf;
  }

  decode(buffer) {
    this.totalSize = Buffer.byteLength(buffer);
    this.userHash = buffer.toString('hex', 0, 16);
    this.clientId = buffer.readUInt32LE(16);
    this.tcpPort = buffer.readUInt16LE(20);
    this.tagList = Tag.decode2Tags(buffer.slice(22));
  }

  static get OPCODE() {
    return OPCODE;
  }
}

module.exports = HelloAnswer;