const assert = require('assert');
const Buffer = require('buffer').Buffer;
const GetServerList = require('../../../lib/protocol/server/GetServerList');

describe('get server packet', () => {
  it('#encode', () => {
    let getServerList = new GetServerList();
    assert(!getServerList.encode().length);
  });
});