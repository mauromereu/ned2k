const assert = require('assert');
const Buffer = require('buffer').Buffer;
const ServerIdent = require('../../../lib/protocol/server/ServerIdent');

describe('server ident packet', () => {
  it('#encode', () => {
    let serverIdent = new ServerIdent();
    let buf = serverIdent.encode();
    assert.deepEqual(buf, Buffer.from([
      0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
      0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
      0x0, 0x0, 0x0, 0x0, 0x36, 0x12, 0x02, 0x0,
      0x0, 0x0, 0x02, 0x01, 0x00, 0x01, 0x0, 0x0,
      0x02, 0x01, 0x00, 0x0b, 0x0, 0x0
    ]));
  });

  it('#decode', () => {
    let serverIdent = new ServerIdent({
      hash: 'ned2k',
      ip: 0x01,
      port: 4661,
      serverName: 'ned2k server',
      serverDesc: 'ned2k client 2 server'
    });

    let buf = serverIdent.encode();
    let decodeServIdent = new ServerIdent();
    decodeServIdent.decode(buf);

    assert(decodeServIdent.hash == '6e6564326b0000000000000000000000');
    assert(decodeServIdent.ip == serverIdent.ip);
    assert(decodeServIdent.port == serverIdent.port);
    assert(decodeServIdent.serverName == serverIdent.serverName);
    assert(decodeServIdent.serverDesc == serverIdent.serverDesc);
    assert(decodeServIdent.tagList.length == 2);
    assert(decodeServIdent.tagList[0].data == serverIdent.serverName);
    assert(decodeServIdent.tagList[1].data == serverIdent.serverDesc);
  });
});