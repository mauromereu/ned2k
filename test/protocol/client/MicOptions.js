const assert = require('assert');
const MicOptions = require('../../../lib/protocol/client/MicOptions');

describe('mic options', () => {
  let micOptions = null;
  beforeEach(() => {
    micOptions = new MicOptions();
  });

  it('#intVal', () => {
    assert(!micOptions.intValue());
  });

  it('#assign', () => {
    micOptions.assign(1);
    assert(micOptions.intValue());
  });
});