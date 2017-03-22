const TCPConn = require('./TCPConn');
const HeaderPacket = require('./protocol/Header');
const LoginRequestPacket = require('./protocol/server/LoginRequest');
const ServerMessage = require('./protocol/server/ServerMessage');
const ServerStatus = require('./protocol/server/ServerStatus');
const IdChange = require('./protocol/server/IdChange');
const GetServerList = require('./protocol/server/GetServerList');
const ServerList = require('./protocol/server/ServerList');
const ServerIdent = require('./protocol/server/ServerIdent');
const OfferFiles = require('./protocol/server/OfferFiles');
const SearchRequest = require('./protocol/server/search/SearchRequest');
const SearchResults = require('./protocol/server/search/SearchResults');
const Session = require('./Session');
const Constant = require('./Constant');
const combinePackets = require('./helper/combinePackets');

const KEEPALIVE_TIME = 60;

class ServerConn extends TCPConn {
  constructor(host, port, session) {
    super(host, port);
    this._keepAliveTimer = null;
    this._session = session || new Session({ host: host, port: port });
    this.on('connect', this._connectHandler.bind(this));
    this.on('processend', this._processEndHandler.bind(this));
    this.on('package:idChange', this._idChangeHandler.bind(this));
    this.on('close', this._closeHandler.bind(this));
  }

  offerFiles(files = []) {
    let header = new HeaderPacket();
    let offerFiles = new OfferFiles(files);
    this.write(combinePackets(header, offerFiles));
  }

  search({
    originString,
    type = Constant.FILETYPE.ANY,
    minSize = 0x00, // byte
    maxSize = 0x00, // byte
    sourceNum = 0x00,
    ext = ''
  }) {
    let header = new HeaderPacket();
    let searchRequest = new SearchRequest(...arguments);
    this.write(combinePackets(header, searchRequest));
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
        let offerFiles = new OfferFiles();
        header = new HeaderPacket();
        this.write(combinePackets(header, offerFiles));

        // login handshake complete, you can offer files and so on next...
        this.emit('ready');
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
      case SearchResults.OPCODE:
        let searchResults = new SearchResults();
        searchResults.decode(bodyBuffer);
        this.emit('package:searchResults', searchResults.files);
    }
  }

  _idChangeHandler() {
    this._keepAliveTimer = setTimeout(() => {
      let header = new HeaderPacket();
      let offerFiles = new OfferFiles();
      this.write(combinePackets(header, offerFiles));
      this._idChangeHandler();
    }, KEEPALIVE_TIME * 1000);
  }

  _closeHandler() {
    clearTimeout(this._keepAliveTimer);
  }
}

module.exports = ServerConn;