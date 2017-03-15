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
});