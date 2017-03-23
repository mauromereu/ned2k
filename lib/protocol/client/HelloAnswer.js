const Buffer = require('buffer').Buffer;
const Hello = require('./Hello');

const OPCODE = 0x4c;
const STABLE_SIZE = 22;

class HelloAnswer extends Hello {
  constructor(params = {}) {
    super(params);
    this.serverIp = params.serverIp || 0x0;
    this.serverPort = params.serverPort || 4662;
  }

  encode() {
    let buf = super.encode();

    // encode server ip and port
    let serverBuf = Buffer.alloc(6);
    serverBuf.writeUInt32LE(this.serverIp, 0);
    serverBuf.writeUInt16LE(this.serverPort, 4);

    buf = Buffer.concat([buf, serverBuf]);
    this.totalSize = buf.length;

    return buf;
  }

  decode(buffer) {
    super.decode(buffer);

    // decode server ip and port
    let tagTotalLen = this.tagList.map((tag) => {
      return tag.totalSize;
    }).reduce((v1, v2) => {
      return v1 + v2;
    });

    buffer = buffer.slice(STABLE_SIZE + 4 + tagTotalLen);
    this.serverIp = buffer.readUInt32LE(0);
    this.serverPort = buffer.readUInt16LE(4);
  }

  static get OPCODE() {
    return OPCODE;
  }
}

module.exports = HelloAnswer;