const TcpConn = require('./TCPConn');
const Header = require('./protocol/HeaderPacket');
const Conn = require('./protocol/server/ConnPacket');

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