const TCPConn = require('./TCPConn');
const Constant = require('./Constant');
const HeaderPacket = require('./protocol/Header');
const LoginRequestPacket = require('./protocol/server/LoginRequest');
const Session = require('./Session');
const combinePackets = require('./helper/combinePackets');

class ServerConn extends TCPConn {
  constructor(host, port) {
    super(host, port);
    this._session = new Session();
    this.addListener('connect', this._connectHandler.bind(this));
    this.addListener('data', this._dataHandler.bind(this));
  }

  _connectHandler() {
    // say hello to server
    let header = new HeaderPacket(Constant.OP_LOGINREQUEST);
    let loginReq = new LoginRequestPacket(this._session);
    this.write(combinePackets(header, loginReq));
  }

  _dataHandler(info) {
    let headerPacket = info.headerPacket;
    let bodyBuffer = info.bodyBuffer;
  }
}

module.exports = ServerConn;