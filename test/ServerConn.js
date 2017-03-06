const assert = require('assert');
const ServerConn = require('../lib/ServerConn');

const SERVER_HOST = '222.40.142.3';
const SERVER_PORT = 40072;

describe('ServerConn', () => {
  let server = null;
  beforeEach(() => {
    server = new ServerConn(SERVER_HOST, SERVER_PORT);
  });

  it('#connect', (done) => {
    server.addListener('connect', done);
  });

  it('#login', (done) => {
    server.addListener('data', (info) => {
      done();
    });
  });
});