/**
 *  +--------+--------+--------+--------+--------+--------+--------+--------+-------------
 *  |protocol(1) |            packet length(4)          |  packet data (length bytes)(1)
 *  +--------+--------+--------+--------+--------+--------+--------+--------+-------------
 * 
 *  packet data:
 *      PR_ED2K  = 0xe3,  //!< Standard, historical eDonkey2000 protocol
 *      PR_EMULE = 0xc5,  //!< eMule extended protocol
 *      PR_ZLIB  = 0xd4   //!< Packet payload is compressed with gzip
 */

const assert = require('assert');
const Buffer = require('buffer').Buffer;
const UsualPacket = require('./UsualPacket');

const TOTAL_SIZE = 6;
const PROTOCOL = {
  PR_ED2K: 0xe3,
  PR_EMULE: 0xc5,
  PR_ZLIB: 0xd4
};

class Header extends UsualPacket {
  constructor(protocol = PROTOCOL.PR_ED2K) {
    super();
    this.totalSize = TOTAL_SIZE;
    this.protocol = protocol;
    this.optype = 0x01;
    this.size = 0x0;
  }

  encode() {
    let buffer = Buffer.alloc(TOTAL_SIZE);
    buffer.writeUInt8(this.protocol, 0);
    buffer.writeUInt32LE(this.size, 1);
    buffer.writeUInt8(this.optype, 5);
    return buffer;
  }

  decode(buffer) {
    assert(Buffer.byteLength(buffer) == TOTAL_SIZE, 'length less than header total length(6)');
    this.protocol = buffer.readUInt8(0);
    this.size = buffer.readUInt32LE(1);
    this.optype = buffer.readUInt8(5);
  }

  static get PROTOCOL() {
    return PROTOCOL;
  }
}

module.exports = Header;