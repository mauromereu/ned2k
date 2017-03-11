const Buffer = require('buffer').Buffer;
const UsualPacket = require('../UsualPacket');
const Tag = require('../tag/Tag');
const Constant = require('../../Constant');
const MicOptions = require('./MicOptions');

const OPCODE = 0x01;
const STABLE_SIZE = 22;
const CT = {
  NICK: 0x01,
  PORT: 0x0f,
  MULEVERSION: 0xfb,
  MODSTR: 0x55,
  UDPPORTS: 0xf9,
  MISCFEATURES: 0xfa
};

class Hello extends UsualPacket {
  constructor({ compressVersion, nickname, userHash, clientId, tcpPort }) {
    super();
    this.compressVersion = compressVersion;
    this.nickname = nickname;
    this.userHash = userHash;
    this.clientId = clientId;
    this.tcpPort = tcpPort;
    this.tagList = {};
  }

  encode() {
    let { compressVersion, nickname, userHash, clientId, tcpPort } = this;
    let buf = Buffer.alloc(22);
    buf.write(userHash, 0);
    buf.writeUInt32LE(clientId, 16);
    buf.writeUInt16LE(tcpPort, 18);

    let arr = [];
    let tag = new Tag(Tag.TYPE.TT_STRING, CT.NICK, nickname);
    arr.push(tag.encode());

    tag = new Tag(Tag.TYPE.TT_UINT16, CT.PORT, tcpPort);
    arr.push(tag.encode());

    tag = new Tag(Tag.TYPE.TT_UINT32, CT.MULEVERSION, Constant.APP_VERSION);
    arr.push(tag.encode());

    tag = new Tag(Tag.TYPE.MODSTR, CT.MODSTR, Constant.MODSTR);
    arr.push(tag.encode());

    tag = new Tag(Tag.TYPE.UDPPORTS, CT.UDPPORTS, 0);
    arr.push(tag.encode());

    let micOptions = new MicOptions();
    micOptions.unicodeSupport = 1;
    micOptions.dataCompVer = compressVersion;
    micOptions.noViewSharedFiles = 1;
    micOptions.sourceExchange1Ver = 0;

    tag = new Tag(Tag.TYPE.TT_UINT32, CT.MISCFEATURES, micOptions.intValue());
    arr.push(tag.encode());

    buf = Buffer.concat([buf].concat(arr));
    this.totalSize = buf.length;

    return buf;
  }

  decode(buffer) {
    this.userHash = buffer.read(0, 16).toString('utf-8');
    this.clientId = buffer.readUInt32LE(16);
    this.tcpPort = buffer.readUInt16LE(20);
    this.tagList = Tag.decode2Tags(buffer.slice(22));
  }

  static get OPCODE() {
    return OPCODE;
  }
}

module.exports = Hello;