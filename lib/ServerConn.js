const TCPConn = require('./TCPConn');
const HeaderPacket = require('./protocol/Header');
const LoginRequestPacket = require('./protocol/server/LoginRequest');
const ServerMessage = require('./protocol/server/ServerMessage');
const ServerStatus = require('./protocol/server/ServerStatus');
const IdChange = require('./protocol/server/IdChange');
const GetServerList = require('./protocol/server/GetServerList');
const ServerList = require('./protocol/server/ServerList');
const ServerIdent = require('./protocol/server/ServerIdent');
const Session = require('./Session');
const combinePackets = require('./helper/combinePackets');

class ServerConn extends TCPConn {
  constructor(host, port, session) {
    super(host, port);
    this._session = session || new Session();
    this.on('connect', this._connectHandler.bind(this));
    this.on('processend', this._processEndHandler.bind(this));
  }

  _connectHandler() {
    // say hello to server
    let header = new HeaderPacket();
    let loginReq = new LoginRequestPacket(this._session);
    this.write(combinePackets(header, loginReq));
  }

  _processEndHandler(info) {
    let headerPacket = info.headerPacket;
    let bodyBuffer = info.bodyBuffer;
    let header = null;

    switch (headerPacket.optype) {
      case ServerMessage.OPCODE:
        let serverMsg = new ServerMessage();
        serverMsg.decode(bodyBuffer);
        this.emit('package:serverMessage', serverMsg.message);
        break;
      case ServerStatus.OPCODE:
        let serverStatus = new ServerStatus();
        serverStatus.decode(bodyBuffer);
        this.emit('package:serverStatus', {
          users: serverStatus.users,
          files: serverStatus.files
        });
        break;
      case IdChange.OPCODE:
        let idChange = new IdChange();
        idChange.decode(bodyBuffer);
        this._session.clientId = idChange.newId;
        this.emit('package:idChange', idChange.newId);

        // option package, we send it to fill us server list
        let getServerList = new GetServerList();
        header = new HeaderPacket();
        this.write(combinePackets(header, getServerList));

        // offer files to server

        break;
      case ServerList.OPCODE:
        let serverList = new ServerList();
        serverList.decode(bodyBuffer);
        this.emit('package:serverList', serverList.list);
        break;
      case ServerIdent.OPCODE:
        let serverIdent = new ServerIdent();
        serverIdent.decode(bodyBuffer);
        this.emit('package:serverIdent', {
          hash: serverIdent.hash,
          ip: serverIdent.ip,
          port: serverIdent.port,
          serverName: serverIdent.serverName,
          serverDesc: serverIdent.serverDesc
        });
        break;
    }
  }
}

module.exports = ServerConn;