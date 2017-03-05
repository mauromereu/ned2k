const USER_HASH = '5d430a6c2d0ea11999f6eafff0996fdd';
const DEFAULT_TCP_PORT = 4662;
const DEFAULT_NICKNAME = 'ned2k';

class Session {
  constructor() {
    this.nickname = DEFAULT_NICKNAME;
    this.userHash = USER_HASH;
    this.clientIp = 0x0;
    this.tcpPort = DEFAULT_TCP_PORT;
  }
}

module.exports = Session;