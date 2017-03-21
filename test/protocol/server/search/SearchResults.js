const assert = require('assert');
const Buffer = require('buffer').Buffer;
const SearchResults = require('../../../../lib/protocol/server/search/SearchResults');
const Tag = require('../../../../lib/protocol/Tag/Tag');
const CT = SearchResults.CT;

describe('search results packet', () => {
  let files = [];
  beforeEach(() => {
    files = [{
      hash: '',
      ip: 0x0,
      port: 4662,
      name: 'filename',
      size: 1 * 1024 * 1024,
      type: SearchResults.FILETYPE.VIDEO,
      sources: 100,
      complsrc: 1
    }];
  });

  it('#encode', () => {
    let searchResults = new SearchResults(files);
    let buf = searchResults.encode();

    assert.equal(buf.readUInt32LE(0), 1);
    assert.equal(buf.toString('hex', 4, 20), '00000000000000000000000000000000');
    assert.equal(buf.readUInt32LE(20), 0x0);
    assert.equal(buf.readUInt16LE(24), 4662);
    assert.deepEqual(buf.slice(26), Tag.encode2Buffer([
      { type: Tag.TYPE.TT_STRING, opcode: CT.FILENAME, data: files[0].name },
      { type: Tag.TYPE.TT_UINT32, opcode: CT.FILESIZE, data: files[0].size },
      { type: Tag.TYPE.TT_STRING, opcode: CT.FILETYPE, data: files[0].type },
      { type: Tag.TYPE.TT_UINT32, opcode: CT.SOURCES, data: files[0].sources },
      { type: Tag.TYPE.TT_UINT32, opcode: CT.COMPLSRC, data: files[0].complsrc }
    ]));
  });

  it('#decode', () => {
    let searchResults = new SearchResults(files);
    let buf = searchResults.encode();

    searchResults = new SearchResults();
    searchResults.decode(buf);

    let fileItem = searchResults.files[0];
    assert(fileItem.hash == '00000000000000000000000000000000');
    assert(fileItem.ip == 0x0);
    assert(fileItem.port == 4662);
    assert(fileItem.name == 'filename');
    assert(fileItem.size == 1024 * 1024);
    assert(fileItem.type == SearchResults.FILETYPE.VIDEO);
    assert(fileItem.sources == 100);
    assert(fileItem.complsrc == 1);
  });
});