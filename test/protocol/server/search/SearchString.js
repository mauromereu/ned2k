const assert = require('assert');
const SearchString = require('../../../../lib/protocol/server/search/SearchString');
const inspect = require('util').inspect;

describe('search string test', () => {
    const str = '(HelloWorld AND ((You OR Me) AND Best)) NOT andycall'    
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
    };
    
    it('# formatSearchString', () => {
        let search = new SearchString(str);
        let rightGroup = ['(HelloWorld AND ((You OR Me) AND Best))', 'NOT', 'andycall'];
        let group = search.formatSearchString(str);
        assert.deepEqual(group, rightGroup);
    });

    it('# generate binary tree', () => {
        let search = new SearchString(str);
        let binaryTree = search.buildSearchTree(str);
        assert.deepEqual(binaryTree, tree);
    });

    it('get Formated SearchString', () => {
        let search = new SearchString(str);
        let searchResult = search.printFormatedString();
        let result = 'NOTANDHelloWorldANDORYouMeBestandycall';
        assert.equal(searchResult, result);
    });
});