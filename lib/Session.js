const USER_HASH = '5d430a6c2d0ea11999f6eafff0996fdd';
const DEFAULT_TCP_PORT = 4662;
const DEFAULT_NICKNAME = 'ned2k';

class Session {
  constructor() {
    this.nickname = DEFAULT_NICKNAME;
    this.userHash = USER_HASH;
    this.clientId = 0x0;
    this.tcpPort = DEFAULT_TCP_PORT;
    this.kadUDPPort = 0;
    this.ed2kUDPPort = 0;
    this.compressVersion = 0; // use 1 for activate compression
  }
}

module.exports = Session;