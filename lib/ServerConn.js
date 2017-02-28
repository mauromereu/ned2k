const TCPConn = require('./TCPConn');
const Constant = require('./Constant');
const HeaderPacket = require('./protocol/Header');
const LoginRequestPacket = require('./protocol/server/LoginRequest');

class ServerConn extends TCPConn {
    constructor(host, port) {
        super(host, port);
        this.addListener('connect', this._connectHandler.bind(this));
        this.addListener('data', this._dataHandler.bind(this));
    }

    _connectHandler() {

    }

    _dataHandler(info) {
        let headerPacket = info.headerPacket;
        let bodyBuffer = info.bodyBuffer;
    }
}

module.exports = ServerConn;