const Buffer = require('buffer').Buffer;
const UsualPacket = require('../UsualPacket');

const OPCODE = 0x32;

class ServerList extends UsualPacket {
  constructor(list) {
    super();
    this.list = list || [];
  }

  encode() {
    let count = this.list.length || 0;
    let buf = Buffer.alloc(1);
    buf.writeUInt8(count);

    let arr = [];
    for (let i = 0; i < count; i++) {
      let listItem = this.list[i];
      let buf = Buffer.alloc(6);
      buf.writeUInt32LE(listItem.ip || 0, 0);
      buf.writeUInt16LE(listItem.port || 4662, 4);
      arr.push(buf);
    }

    this.totalSize = 1 + count * 6;
    return Buffer.concat([buf].concat(arr));
  }

  decode(buffer) {
    super.decode(buffer);
    let count = buffer.readUInt8(0);
    buffer = buffer.slice(1);
    this.list = [];

    for (let i = 0; i < count; i++) {
      let ip = buffer.readUInt32LE(0);
      let port = buffer.readUInt16LE(4);
      this.list.push({ ip: ip, port: port });
      buffer = buffer.slice(6);
    }
  }

  static get OPCODE() {
    return OPCODE;
  }
}

module.exports = ServerList;