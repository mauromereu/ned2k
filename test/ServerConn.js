const assert = require('assert');
const ServerConn = require('../lib/ServerConn');

const SERVER_HOST = '222.40.142.3';
const SERVER_PORT = 40072;

describe('ServerConn', () => {
  let server = null;
  beforeEach(() => {
    server = new ServerConn(SERVER_HOST, SERVER_PORT);
  });

  afterEach(() => {
    server.destory();
  })

  it('#connect', (done) => {
    server.addListener('connect', done);
  });

  it('#login request', (done) => {
    server.addListener('data', (info) => {
      done();
    });
  });

  it('#server message', (done) => {
    server.addListener('serverMessage', (message) => {
      if (message) {
        done();
      }
    });
  });

  it('#server status', (done) => {
    server.addListener('serverStatus', (data) => {
      if (data.users != null && data.files != null) {
        done();
      }
    });
  });

  it('#id change', (done) => {
    server.addListener('idChange', (newId) => {
      newId && done();
    });
  });
});