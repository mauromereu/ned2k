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
const Constant = require('../Constant');

const PROTOCOL = {
    PR_ED2K: 0xE3,
    PR_EMULE: 0xC5,
    PR_ZLIB: 0xd4
};

const TOTAL_SIZE = 6;
const SIZE = {
    PROTOCOL: 1,
    SIZE: 4,
    TYPE: 1
};

class Header extends UsualPacket {
    constructor() {
        this.protocol = PROTOCOL.PR_ED2K;
        this.type = 0x0;
        this.size = 0x0;
    }

    encode() {
        let buffer = Buffer.alloc(TOTAL_SIZE);
        buffer.writeInt8(this.protocol, 0);
        buffer.writeUInt32LE(this.size, 1);
        buffer.writeInt8(this.type, 5);
        return buffer;
    }

    decode(buffer) {
        assert(Buffer.byteLength(buffer) != TOTAL_SIZE, 'length less than header total length(6)');
        this.protocol = buffer.readInt8(0);
        this.size = buffer.readUInt32LE(1);
        this.type = buffer.readInt8(5);
    }

    static get PROTOCOL() {
        return PROTOCOL;
    }

    static get TOTAL_SIZE() {
        return TOTAL_SIZE;
    }

    static get SIZE() {
        return SIZE;
    }
}

module.exports = Header;