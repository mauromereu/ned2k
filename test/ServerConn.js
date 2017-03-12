const assert = require('assert');
const ServerConn = require('../lib/ServerConn');

const SERVER_HOST = '222.40.142.3';
const SERVER_PORT = 40072;

describe('ServerConn', () => {
  let server = null;
  beforeEach(() => {
    server = new ServerConn(SERVER_HOST, SERVER_PORT);
    server.isDone = false;
  });

  afterEach(() => {
    server.destory();
  })

  it('#connect', (done) => {
    server.on('connect', done);
  });

  it('#login request', (done) => {
    server.isDone = false;
    server.on('processend', (info) => {
      if (!server.isDone) {
        server.isDone = true;
        done();
      }
    });
  });

  it('#server message', (done) => {
    server.addListener('serverMessage', (message) => {
      if (!server.isDone && message) {
        server.isDone = true;
        done();
      }
    });
  });

  it('#server status', (done) => {
    server.addListener('serverStatus', (data) => {
      if (!server.isDone && data.users != null && data.files != null) {
        server.isDone = true;
        done();
      }
    });
  });

  it('#id change', (done) => {
    server.addListener('idChange', (newId) => {
      if (!server.isDone && newId) {
        done();
      }
    });
  });
});