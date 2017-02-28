const UsualPacket = require('../UsualPacket');

const TOTAL_SIZE = 0x0;
const SIZE = {};

class LoginRequest extends UsualPacket {
    encode() {

    }

    static get TOTAL_SIZE() {
        return TOTAL_SIZE;
    }

    static get SIZE() {
        return SIZE;
    }
}

module.exports = LoginRequest;