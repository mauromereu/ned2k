const assert = require('assert');
const Conn = require('../lib/Conn');

const SERVER_HOST = '222.40.142.3';
const SERVER_PORT = 40072;

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