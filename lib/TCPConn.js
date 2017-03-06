const EventEmitter = require('events');
const Socket = require('net').Socket;
const Buffer = require('buffer').Buffer;
const HeaderPacket = require('./protocol/Header');

const SOCKET_TIMEOUT = 5000;
const SOCKET_NODELAY = true;
const PARSE_HEADER_STATE = 0;
const PARSE_BODY_STATE = 1;

class TCPConn extends EventEmitter {
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

    this._socket.addListener('connect', this._onConnHandler.bind(this));
    this._socket.addListener('timeout', this._onTimeoutHandler.bind(this));
    this._socket.addListener('data', this._onDataHandler.bind(this));
    this._socket.addListener('error', this._onErrorHandler.bind(this));
    this._socket.addListener('close', this._onCloseHandler.bind(this));
    this._socket.connect(port, host);

    this._state = PARSE_HEADER_STATE;
    this._buffer = Buffer.alloc(0);
    this._headerPacket = new HeaderPacket();
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
    this._buffer = Buffer.concat([this._buffer, buffer]);
    let bufSize = Buffer.byteLength(this._buffer);
    let headerPacketSize = this._headerPacket.totalSize;

    while (true) {
      switch (this._state) {
        case PARSE_HEADER_STATE:
          if (bufSize < headerPacketSize) {
            return;
          }

          this._headerPacket.decode(this._buffer.slice(0, headerPacketSize));
          this._buffer = this._buffer.slice(headerPacketSize);
          this._state = PARSE_BODY_STATE;
          bufSize -= headerPacketSize;
          break;
        case PARSE_BODY_STATE:
          let size = this._headerPacket.size - 1;
          if (bufSize < size) {
            return;
          }

          this.emit('data', {
            headerPacket: this._headerPacket,
            bodyBuffer: this._buffer.slice(0, size)
          });

          this._buffer = this._buffer.slice(size);
          this._headerPacket = new HeaderPacket();
          this._state = PARSE_HEADER_STATE;
          bufSize -= size;
          break;
      }
    }
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