const Socket = require('net').Socket;
const Buffer = require('buffer').Buffer;
const HeaderPacket = require('./protocol/Header');
const BufferDecoder = require('./BufferDecoder');

const SOCKET_TIMEOUT = 5000;
const SOCKET_NODELAY = true;
const PARSE_HEADER_STATE = 0;
const PARSE_BODY_STATE = 1;

class TCPConn extends BufferDecoder {
  constructor(host, port) {
    super();

    this.host = host;
    this.port = port;
    this._socket = new Socket({
      allowHalfOpen: false,
      readable: true,
      writable: true
    });

    this._socket.setTimeout(SOCKET_TIMEOUT);
    this._socket.setNoDelay(SOCKET_NODELAY);

    this._socket.on('connect', this._onConnHandler.bind(this));
    this._socket.on('timeout', this._onTimeoutHandler.bind(this));
    this._socket.on('data', this._onDataHandler.bind(this));
    this._socket.on('error', this._onErrorHandler.bind(this));
    this._socket.on('close', this._onCloseHandler.bind(this));
    this._socket.connect(port, host);
  }

  write(buffer) {
    this._socket.write(buffer);
  }

  destory() {
    this._socket.destroy();
  }

  _onConnHandler() {
    this.emit('connect');
  }

  _onTimeoutHandler() {
    this.emit('timeout');
  }

  _onDataHandler(buffer) {
    this.processBuffer(buffer);
  }

  _onErrorHandler(error) {
    this.emit('error', error);
  }

  _onCloseHandler() {
    this.emit('close');
    this.removeAllListeners();
  }
}

module.exports = TCPConn;