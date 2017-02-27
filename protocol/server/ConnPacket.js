const UsualPacket = require('../UsualPacket');

class ConnPacket extends UsualPacket {
    encode() {

    }
}

exports.Protocol = ConnPacket;
exports.SIZE = {};
exports.TOTAL_SIZE = 0;