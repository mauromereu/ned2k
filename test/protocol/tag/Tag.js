const assert = require('assert');
const Buffer = require('buffer').Buffer;
const Tag = require('../../../lib/protocol/tag/Tag');

describe('tag', () => {
  it('#encode uint8', () => {
    let tag = new Tag({ type: Tag.TYPE.TT_UINT8, opcode: 0x01, data: 1 });
    let buf = tag.encode();
    assert.deepEqual(buf, Buffer.from([Tag.TYPE.TT_UINT8, 0x01, 0x00, 0x01, 0x01]));
  });

  it('#encode uint16', () => {
    let tag = new Tag({ type: Tag.TYPE.TT_UINT16, opcode: 0x01, data: 1 });
    let buf = tag.encode();
    assert.deepEqual(buf, Buffer.from([Tag.TYPE.TT_UINT16, 0x01, 0x00, 0x01, 0x01, 0x00]));
  });

  it('#encode uint32', () => {
    let tag = new Tag({ type: Tag.TYPE.TT_UINT32, opcode: 0x01, data: 1 });
    let buf = tag.encode();
    assert.deepEqual(buf, Buffer.from([Tag.TYPE.TT_UINT32, 0x01, 0x00, 0x01, 0x01, 0x00, 0x00, 0x00]));
  });

  it('#encode string', () => {
    let tag = new Tag({ type: Tag.TYPE.TT_STRING, opcode: 0x01, data: 'w' });
    let buf = tag.encode();
    assert.deepEqual(buf, Buffer.from([Tag.TYPE.TT_STRING, 0x01, 0x00, 0x01, 0x01, 0x00, 0x77]));
  });

  it('#encode float', () => {
    let tag = new Tag({ type: Tag.TYPE.TT_FLOAT, opcode: 0x01, data: 1.1 });
    let buf = tag.encode();
    assert.deepEqual(buf, Buffer.from([Tag.TYPE.TT_FLOAT, 0x01, 0x00, 0x01, 0xcd, 0xcc, 0x8c, 0x3f]));
  });

  it('#encode2Buffer static method', () => {
    let tag8 = new Tag({ type: Tag.TYPE.TT_UINT8, opcode: 0x01, data: 1 });
    let tag16 = new Tag({ type: Tag.TYPE.TT_UINT16, opcode: 0x01, data: 1 });
    let tag32 = new Tag({ type: Tag.TYPE.TT_UINT32, opcode: 0x01, data: 1 });
    let tagString = new Tag({ type: Tag.TYPE.TT_STRING, opcode: 0x01, data: 'w' });
    let tagFloat = new Tag({ type: Tag.TYPE.TT_FLOAT, opcode: 0x01, data: 1.1 });

    let header = Buffer.alloc(4);
    header.writeUInt32LE(5);

    let packet = Buffer.concat([header, tag8.encode(), tag16.encode(), tag32.encode(), tagString.encode(), tagFloat.encode()]);
    let buffer = Tag.encode2Buffer([
      { type: Tag.TYPE.TT_UINT8, opcode: 0x01, data: 1 },
      { type: Tag.TYPE.TT_UINT16, opcode: 0x01, data: 1 },
      { type: Tag.TYPE.TT_UINT32, opcode: 0x01, data: 1 },
      { type: Tag.TYPE.TT_STRING, opcode: 0x01, data: 'w' },
      { type: Tag.TYPE.TT_FLOAT, opcode: 0x01, data: 1.1 }
    ]);

    assert.deepEqual(packet, buffer);
  });

  it('#decode2Tags static method', () => {
    let tag8 = new Tag({ type: Tag.TYPE.TT_UINT8, opcode: 0x01, data: 1 });
    let tag16 = new Tag({ type: Tag.TYPE.TT_UINT16, opcode: 0x01, data: 1 });
    let tag32 = new Tag({ type: Tag.TYPE.TT_UINT32, opcode: 0x01, data: 1 });
    let tagString = new Tag({ type: Tag.TYPE.TT_STRING, opcode: 0x01, data: 'w' });
    let tagFloat = new Tag({ type: Tag.TYPE.TT_FLOAT, opcode: 0x01, data: 1.1 });

    let header = Buffer.alloc(4);
    header.writeUInt32LE(5);

    let packet = Buffer.concat([header, tag8.encode(), tag16.encode(), tag32.encode(), tagString.encode(), tagFloat.encode()]);
    let tags = Tag.decode2Tags(packet);

    assert(tags[0].type == Tag.TYPE.TT_UINT8 && tags[0].opcode == 0x01 && tags[0].data == 0x01 && tags[0].totalSize == 5);
    assert(tags[1].type == Tag.TYPE.TT_UINT16 && tags[1].opcode == 0x01 && tags[1].data == 0x01 && tags[1].totalSize == 6);
    assert(tags[2].type == Tag.TYPE.TT_UINT32 && tags[2].opcode == 0x01 && tags[2].data == 0x01 && tags[2].totalSize == 8);
    assert(tags[3].type == Tag.TYPE.TT_STRING && tags[3].opcode == 0x01 && tags[3].data == 'w' && tags[3].totalSize == 7);
    assert(tags[4].type == Tag.TYPE.TT_FLOAT && tags[4].opcode == 0x01 && Math.abs(tags[4].data - 1.1) < 0.0001 && tags[4].totalSize == 8);
  });

  it('#toKVObject static method', () => {
    let tags = [
      new Tag({ type: Tag.TYPE.TT_STRING, opcode: 0x01, data: 'a' }),
      new Tag({ type: Tag.TYPE.TT_STRING, opcode: 0x02, data: 'b' }),
    ];

    let obj = Tag.toKVObject(tags, {
      SERVERNAME: 0x01,
      SERVERIDENT: 0x02
    });

    assert(obj.servername == 'a' && obj.serverident == 'b');
  });
});