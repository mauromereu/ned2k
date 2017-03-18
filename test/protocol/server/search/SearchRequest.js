const assert = require('assert');
const Buffer = require('buffer').Buffer;
const SearchRequest = require('../../../../lib/protocol/server/search/SearchRequest');

describe('search request packet', () => {
  it('#encode with only search string(one word)', () => {
    let searchReq = new SearchRequest({
      originString: 'java'
    });

    let buf = searchReq.encode();
    assert.deepEqual(buf, [
      0x01, 0x04, 0x00, // STRING 4
      0x6a, 0x61, 0x76, 0x61, // java
      0x02, 0x03, 0x00, // TYPE 3
      0x41, 0x6e, 0x79, // Any
      0x01, 0x00, 0x03 // NEMONIC.TYPE
    ]);
  });

  it('#encode with only search string(one AND string)', () => {
    let searchReq = new SearchRequest({
      originString: 'java AND php'
    });

    let buf = searchReq.encode();
    assert.deepEqual(buf, [
      0x00, 0x00, // AND
      0x01, 0x04, 0x00, // STRING 4
      0x6a, 0x61, 0x76, 0x61, // java
      0x01, 0x03, 0x00, // STRING 3
      0x70, 0x68, 0x70, // php
      0x02, 0x03, 0x00, // TYPE 3
      0x41, 0x6e, 0x79, // Any
      0x01, 0x00, 0x03 // NEMONIC.TYPE
    ]);
  });

  it('#encode with only search string(multi string)', () => {
    let searchReq = new SearchRequest({
      originString: '(java OR php) AND node'
    });

    let buf = searchReq.encode();
    assert.deepEqual(buf, [
      0x00, 0x00, // AND
      0x00, 0x01, // OR
      0x01, 0x04, 0x00, // STRING 4
      0x6a, 0x61, 0x76, 0x61, // java
      0x01, 0x03, 0x00, // STRING 3
      0x70, 0x68, 0x70, // php
      0x01, 0x04, 0x00, // STRING 4
      0x6e, 0x6f, 0x64, 0x65, // node
      0x02, 0x03, 0x00, // TYPE 3
      0x41, 0x6e, 0x79, // Any
      0x01, 0x00, 0x03 // NEMONIC.TYPE
    ]);
  });

  it('#encode with search string and type', () => {
    let searchReq = new SearchRequest({
      originString: 'a',
      type: SearchRequest.FILETYPE.VIDEO
    });

    let buf = searchReq.encode();
    assert.deepEqual(buf, [
      0x01, 0x01, 0x00, // STRING 1
      0x61, // a
      0x02, 0x05, 0x00, // TYPE 5
      0x56, 0x69, 0x64, 0x65, 0x6f, // Video 
      0x01, 0x00, 0x03 // NEMONIC.TYPE
    ]);
  });

  it('#encode with adding minSize', () => {
    let searchReq = new SearchRequest({
      originString: 'a',
      type: SearchRequest.FILETYPE.VIDEO,
      minSize: 1 * 1024 * 1024
    });

    let buf = searchReq.encode();
    assert.deepEqual(buf, [
      0x01, 0x01, 0x00, // STRING 1
      0x61, // a
      0x02, 0x05, 0x00, // TYPE 5
      0x56, 0x69, 0x64, 0x65, 0x6f, // Video
      0x01, 0x00, 0x03, // NEMONIC.TYPE
      0x00, 0x00, // AND
      0x03, // NUMBER
      0x00, 0x00, 0x10, 0x00, // 1024 * 1024
      0x01, 0x01, 0x00, 0x02 // NEMONIC.MINSIZE
    ])
  });

  it('#encode with adding maxSize', () => {
    let searchReq = new SearchRequest({
      originString: 'a',
      type: SearchRequest.FILETYPE.VIDEO,
      maxSize: 10 * 1024 * 1024
    });

    let buf = searchReq.encode();
    assert.deepEqual(buf, [
      0x01, 0x01, 0x00, // STRING 1
      0x61, // a
      0x02, 0x05, 0x00, // TYPE 5
      0x56, 0x69, 0x64, 0x65, 0x6f, // Video
      0x01, 0x00, 0x03, // NEMONIC.TYPE
      0x00, 0x00, // AND
      0x03, // NUMBER
      0x00, 0x00, 0xa0, 0x00, // 10*1024*1024
      0x02, 0x01, 0x00, 0x02 // NEMONIC.MAXSIZE
    ])
  });

  it('#encode with adding source number', () => {
    let searchReq = new SearchRequest({
      originString: 'a',
      type: SearchRequest.FILETYPE.AUDIO,
      sourceNum: 10
    });

    let buf = searchReq.encode();
    assert.deepEqual(buf, [
      0x01, 0x01, 0x00, // STRING 1
      0x61, // a
      0x02, 0x05, 0x00, // TYPE 5
      0x41, 0x75, 0x64, 0x69, 0x6f, // Audio
      0x01, 0x00, 0x03, // NEMONIC.TYPE
      0x00, 0x00, // AND
      0x03, // NUMBER
      0x0a, 0x00, 0x00, 0x00, // 10
      0x01, 0x01, 0x00, 0x15 // NEMONIC.AVAIBILITY
    ]);
  });

  it('#encode with adding ext', () => {
    let searchReq = new SearchRequest({
      originString: 'a',
      type: SearchRequest.FILETYPE.AUDIO,
      ext: 'jpg'
    });

    let buf = searchReq.encode();
    assert.deepEqual(buf, [
      0x01, 0x01, 0x00, // STRING 1
      0x61, // a
      0x02, 0x05, 0x00, // TYPE 5
      0x41, 0x75, 0x64, 0x69, 0x6f, // Audio
      0x01, 0x00, 0x03, // NEMONIC.TYPE
      0x00, 0x00, // AND
      0x01, 0x03, 0x00, // STRING 3
      0x6a, 0x70, 0x67, // jpg
      0x01, 0x00, 0x04 // NEMONIC.EXT
    ]);
  });
});