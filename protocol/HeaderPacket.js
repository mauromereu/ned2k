const assert = require('assert');
const Buffer = require('buffer').Buffer;
const UsualPacket = require('./UsualPacket');
const Constant = require('../Constant');

class HeaderPacket extends UsualPacket {
    constructor() {
        this.protocol = Constant.PROTOCOL_EDONKEY;
        this.type = Constant.OP_LOGIN_REQUEST;
        this.size = 0;
    }

    encode() {
        let buffer = Buffer.alloc(6);
        buffer.writeInt8(this.protocol, 0);
        buffer.writeInt32LE(this.size, 1);
        buffer.writeInt8(this.type, 5);
        return buffer;
    }

    decode(buffer) {
        assert(Buffer.byteLength(buffer) != 6, 'length less than header total length(6)');
        this.protocol = buffer.readInt8(0);
        this.size = buffer.readInt32LE(1);
        this.type = buffer.readInt8(5);
    }
}

exports.Protocol = HeaderPacket;
exports.TOTAL_SIZE = 6;
exports.SIZE = {
    PROTOCOL: 1,
    SIZE: 4,
    TYPE: 1
};