const net = require('net');
const EventEmitter = require('events');
const Buffer = require('buffer').Buffer;
const Session = require('./Session');
const ServerConn = require('./ServerConn');
const BufferDecoder = require('./BufferDecoder');
const HeaderPacket = require('./protocol/Header');
const HelloPacket = require('./protocol/client/Hello');
const HelloAnswerPacket = require('./protocol/client/HelloAnswer');
const combinePackets = require('./helper/combinePackets');

const MAX_CONNECTIONS = 1000;
const DEFAULT_HOSTNAME = '0.0.0.0';

class Conn extends EventEmitter {
  constructor(host, port) {
    super();
    this._host = host;
    this._port = port;
    this._session = new Session({ serverIp: host, serverPort: port });
    this._initSocketServer(this._session.tcpPort);

    // so, you can listen server connection event to handle data
    this.serverConn = new ServerConn(host, port, this._session);
  }

  _initSocketServer(port) {
    this._socketServer = new net.createServer(this._onConnectHandler.bind(this));
    this._socketServer.maxConnections = MAX_CONNECTIONS;
    this._socketServer.on('error', this._onErrorHandler.bind(this));
    this._socketServer.on('close', this._onCloseHandler.bind(this));
    this._socketServer.listen(port, DEFAULT_HOSTNAME, () => {
      console.log(`[INFO] socket server listen at ${DEFAULT_HOSTNAME}:${port}`);
    });
  };

  destory() {
    this.serverConn.destory();
    this._socketServer.close();
  }

  _onConnectHandler(socket) {
    console.log(`[INFO] client connect to server`);
    this.emit('connect');

    socket._conn = this; // bind to emit event for unit test
    socket._bufferDecoder = new BufferDecoder();
    socket._bufferDecoder.on('processend', this._onClientProcessEndHandler.bind(socket));

    socket.on('data', this._onClientDataHandler.bind(socket));
    socket.on('error', this._onClientErrorHandler.bind(socket));
    socket.on('close', this._onClientCloseHandler.bind(socket));
  }

  _onErrorHandler(error) {
    console.error(`[ERROR] socket server error:${error}`);
    this.emit('error', error);
  }

  _onCloseHandler() {
    this.emit('close');
  }

  _onClientProcessEndHandler(info) {
    let headerPacket = info.headerPacket;
    let bodyBuffer = info.bodyBuffer;

    let header = null;
    let hello = null;
    let helloAnswer = null;

    switch (headerPacket.optype) {
      case HelloPacket.OPCODE:
        hello = new HelloPacket();
        hello.decode(bodyBuffer);
        this._conn.emit('package:hello', hello); // emit to easy test

        // hello need a hello answer to response
        header = new HeaderPacket();
        helloAnswer = new HelloAnswerPacket(this._conn._session);
        this.write(combinePackets(header, helloAnswer));
        break;
      case HelloAnswerPacket.OPCODE:
        helloAnswer = new HelloAnswerPacket();
        helloAnswer.decode(bodyBuffer);
        this._conn.emit('package:helloAnswer', helloAnswer); // emit to easy test
        // sth should do next...
        break;
    }
  }

  _onClientDataHandler(buffer) {
    this._bufferDecoder.processBuffer(buffer);
  }

  _onClientErrorHandler(error) {
    console.error(`[ERROR] peer client error: ${error}`);
  }

  _onClientCloseHandler() {
    this.removeAllListeners();
  }
}

module.exports = Conn;