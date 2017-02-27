const TcpConn = require('./TCPConn');
const HeaderPacket = require('./protocol/HeaderPacket');
const ConnPacket = require('./protocol/server/ConnPacket');

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