const assert = require('assert');
const Buffer = require('buffer').Buffer;
const ServerList = require('../../../lib/protocol/server/ServerList');

describe('server list packet', () => {
  it('#encode', () => {
    let serverList = new ServerList([{ ip: 0x0, port: 4662 }]);
    let buf = serverList.encode();
    assert.deepEqual(buf, Buffer.from([0x01, 0x0, 0x0, 0x0, 0x0, 0x36, 0x12]));
  });

  it('#decode', () => {
    let serverList = new ServerList([{ ip: 0x0, port: 4662 }]);
    let buf = serverList.encode();

    let decodeServList = new ServerList();
    decodeServList.decode(buf);
    assert(decodeServList.list.length == 1 && decodeServList.list[0].ip == 0 && decodeServList.list[0].port == 4662);
  });
});