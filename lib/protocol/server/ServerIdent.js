const Buffer = require('buffer').Buffer;
const UsualPacket = require('../UsualPacket');
const Tag = require('../tag/Tag');

const STABLE_SIZE = 22;
const OPCODE = 0x41;

const CT = {
  SERVERNAME: 0x01,
  SERVERDESC: 0x0b
};

class ServerIdent extends UsualPacket {
  constructor({
    hash,
    ip,
    port,
    serverName,
    serverDesc
  } = {}) {
    super();
    this.hash = hash || '';
    this.ip = ip || 0x0;
    this.port = port || 4662;
    this.serverName = serverName || '';
    this.serverDesc = serverDesc || '';
  }

  encode() {
    let buf = Buffer.alloc(STABLE_SIZE);
    buf.write(this.hash, 0, 16);
    buf.writeUInt32LE(this.ip, 16);
    buf.writeUInt16LE(this.port, 20);

    let tagList = Tag.encode2Buffer([
      { type: Tag.TYPE.TT_STRING, opcode: CT.SERVERNAME, data: this.serverName },
      { type: Tag.TYPE.TT_STRING, opcode: CT.SERVERDESC, data: this.serverDesc }
    ]);

    buf = Buffer.concat([buf, tagList]);
    this.totalSize = buf.length;
    return buf;
  }

  decode(buffer) {
    super.decode(buffer);
    this.hash = buffer.toString('hex', 0, 16);
    this.ip = buffer.readUInt32LE(16);
    this.port = buffer.readUInt16LE(20);

    let tagList = Tag.decode2Tags(buffer.slice(STABLE_SIZE));
    let kv = Tag.toKVObject(tagList, CT);
    this.serverName = kv.servername;
    this.serverDesc = kv.serverdesc;
  }

  static get OPCODE() {
    return OPCODE;
  }

  static get CT() {
    return CT;
  }
}

module.exports = ServerIdent;