const assert = require('assert');
const Buffer = require('buffer').Buffer;
const ipconv = require('../../lib/helper/ipconv');

describe('ipconv', () => {
  it('#itos', () => {
    assert(ipconv.itos(3293691484) == '196.81.190.92');
  });

  it('#stoi', () => {
    assert(ipconv.stoi('196.81.190.92') == 3293691484);
  });
});