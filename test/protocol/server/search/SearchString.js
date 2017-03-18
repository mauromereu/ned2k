const assert = require('assert');
const SearchString = require('../../../../lib/protocol/server/search/SearchString');
const inspect = require('util').inspect;

describe('search string test', () => {
  const str = '(HelloWorld AND ((You OR Me) AND Best)) NOT andycall';
  const tree = {
    command: 'NOT',
    'NOT': {
      left: {
        command: 'AND',
        'AND': {
          left: {
            value: 'HelloWorld',
            left: null,
            right: null
          },
          right: {
            command: 'AND',
            'AND': {
              left: {
                command: 'OR',
                'OR': {
                  left: {
                    value: 'You',
                    left: null,
                    right: null
                  },
                  right: {
                    value: 'Me',
                    left: null,
                    right: null
                  }
                }
              },
              right: {
                value: 'Best',
                left: null,
                right: null
              }
            }
          }
        }
      },
      right: {
        value: 'andycall',
        left: null,
        right: null
      }
    }
  }

  const strGroup = [
    [
      'HelloWorld OR Andycall',
      'OR HelloWorld Andycall'
    ],
    [
      '(HelloWorld AND ((You OR Me) AND Best)) NOT andycall',
      'NOT AND HelloWorld AND OR You Me Best andycall'
    ],
    [
      'andycall NOT (HelloWorld AND ((You OR Me) AND Best))',
      'NOT andycall AND HelloWorld AND OR You Me Best'
    ],
    [
      '(Hello AND ((AAAANDBBB OR CCCCOREEEE) NOT XXXXXX)) AND (OOOOEEX AND ORORBest)',
      'AND AND Hello NOT OR AAAANDBBB CCCCOREEEE XXXXXX AND OOOOEEX ORORBest'
    ]
  ]

  it('# formatSearchString', () => {
    let formatTestCase = [
      [
        '(HelloWorld AND ((You OR Me) AND Best)) NOT andycall', ['HelloWorld AND ((You OR Me) AND Best)', 'NOT', 'andycall']
      ],
      [
        'OOOOEEX AND ORORBest', ['OOOOEEX', 'AND', 'ORORBest']
      ],
      [
        'NOTA AND XXXORXXNOT', ['NOTA', 'AND', 'XXXORXXNOT']
      ],
      [
        'AAAANDBBB OR CCCCOREEEE', ['AAAANDBBB', 'OR', 'CCCCOREEEE']
      ]
    ];

    formatTestCase.forEach(item => {
      let str = item[0];
      let result = item[1];

      let search = new SearchString(str);
      let group = search.formatSearchString(str);
      assert.deepEqual(group, result);
    });
  });

  it('# generate binary tree', () => {
    let search = new SearchString(str);
    let binaryTree = search.buildSearchTree(str);
    assert.deepEqual(binaryTree, tree);
  });

  it('# get Formated SearchString', () => {
    let search = new SearchString(str);
    let searchResult = search.printFormatedString();
    let result = 'NOT AND HelloWorld AND OR You Me Best andycall';
    assert.equal(searchResult, result);
  });

  it('# str group test', () => {
    strGroup.forEach(item => {
      let search = new SearchString(item[0]);
      let searchResult = search.printFormatedString();

      assert.equal(searchResult, item[1]);
    });
  });
});