const assert = require('assert');
const ServerConn = require('../lib/ServerConn');
const Constant = require('../lib/Constant');

const SERVER_HOST = '222.40.142.3';
const SERVER_PORT = 40072;

describe('ServerConn', () => {
  let server = null;
  beforeEach(() => {
    server = new ServerConn(SERVER_HOST, SERVER_PORT);
  });

  afterEach(() => {
    server.destory();
  });

  it('#connect', (done) => {
    server.on('connect', done);
  });

  it('#login request', (done) => {
    server.on('processend', (info) => {
      info && done();
    });
  });

  it('#server message', (done) => {
    server.on('package:serverMessage', (message) => {
      if (message) {
        done();
      }
    });
  });

  it('#server status', (done) => {
    server.on('package:serverStatus', (data) => {
      if (data.users != null && data.files != null) {
        done();
      }
    });
  });

  it('#id change', (done) => {
    server.on('package:idChange', (newId) => {
      newId && done();
    });
  });

  it('#server list', (done) => {
    server.on('package:serverList', (list) => {
      list.length && done();
    });
  });

  it('#server ident', (done) => {
    server.on('package:serverIdent', (info) => {
      info && done();
    });
  });

  it('#offer files', (done) => {
    server.on('ready', () => {
      server.offerFiles([{
        hash: '5d430a6c2d0ea11999f6eafff0996fdd',
        ip: 0x0,
        port: 4662,
        name: 'filename',
        size: 1024 * 1024 * 10,
        type: Constant.FILETYPE.IMAGE
      }]);
    });
  });

  it('#search', (done) => {
    server.on('ready', () => {
      server.search({
        originString: '(java OR nodejs) AND (php NOT it)',
        type: Constant.FILETYPE.VIDEO,
        minSize: 1024 * 1024,
        maxSize: 10 * 1024 * 1024,
        sourceNum: 10,
        ext: 'jpg'
      });
    });
  });
});