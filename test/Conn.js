const assert = require('assert');
const Conn = require('../lib/Conn');

// const SERVER_HOST = '195.154.83.5';
// const SERVER_PORT = 7111;

const SERVER_HOST = '127.0.0.1';
const SERVER_PORT = 5555;

describe('Conn', () => {
  let server = null;
  beforeEach(() => {
    server = new Conn(SERVER_HOST, SERVER_PORT);
  });

  afterEach(() => {
    server.destory();
  })

  it('#connect', (done) => {
    server.on('connect', done);
  });

  it('#hello package', (done) => {
    server.on('package:hello', (helloPackage) => {
      helloPackage && done();
    });
  });
});