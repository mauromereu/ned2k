const EventEmitter = require('events');
const Buffer = require('buffer').Buffer;
const zlib = require('zlib');
const HeaderPacket = require('./protocol/Header');

const PARSE_HEADER_STATE = 0;
const PARSE_BODY_STATE = 1;

class BufferDecoder extends EventEmitter {
  constructor() {
    super();
    this._buffer = Buffer.alloc(0);
    this._state = PARSE_HEADER_STATE;
    this._headerPacket = new HeaderPacket();
  }

  processBuffer(buffer) {
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

          this.emit('processend', {
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
}

module.exports = BufferDecoder;