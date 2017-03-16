function treeNode(str) {
    return {
        value: str,
        left: null,
        right: null
    }
}

function commandNode(command, leftChild, rightChild) {
    return {
        command: command,
        [command]: {
            left: leftChild,
            right: rightChild
        }
    }
}

class SearchString {
    constructor(searchString) {
        this.searchString = searchString;
        this.conditions = [
            'AND',
            'OR',
            'NOT'
        ];
        this.formatedString = [];
    }

    isStringNotHasGroup(str) {
        return this.conditions.every(o => {
            return str.indexOf(o) < 0;
        });
    }

    buildSearchTree(searchString) {
        if (!searchString) {
            return null;
        }
        if (this.isStringNotHasGroup(searchString)) {
            return treeNode(searchString);
        }

        let group = this.formatSearchString(searchString);

        let leftPart = group[0];
        let condition = group[1];
        let rightPart = group[2];

        let leftNode = this.buildSearchTree(leftPart);
        let rightNode = this.buildSearchTree(rightPart);
        let conditionNode = commandNode(condition, leftNode, rightNode);

        return conditionNode;
    }

    walkThroughSearchTree(treeRoot) {
        if (treeRoot) {
            if (treeRoot.command) {
                let command = treeRoot.command;
                this.formatedString.push(command);

                this.walkThroughSearchTree(treeRoot[command].left);
                this.walkThroughSearchTree(treeRoot[command].right);
            }
            else if (treeRoot.value) {
                let value = treeRoot.value;
                this.formatedString.push(value);
            }
        }
    }

    printFormatedString() {
        let searchBinaryTree = this.buildSearchTree(this.searchString);

        this.walkThroughSearchTree(searchBinaryTree);

        return this.formatedString.join('')
    }

    washLogicBlock(string) {
        string = string.trim();
        if (string.slice(0, 1) === '(' && string.slice(-1) === ')') {
            return string.slice(1, -1);
        }

        return string;
    }

    formatSearchString(searchString) {
        let wordIndex = 0;
        let searchGroup = [];

        let isReachBlock = false;
        let blockLevel = 0;

        searchString = this.washLogicBlock(searchString);

        while (wordIndex < searchString.length) {
            let char = searchString[wordIndex];

            // 到达底层逻辑区域，直接跳过，
            // 搜索直到 )为止，同时要跳过多级（）区域。
            // 最后修正wordIndex指向，保证复杂度是O(n)
            if (char === '(') {
                let nextIndex = wordIndex + 1;
                blockLevel++;

                while (nextIndex < searchString.length) {
                    let nextChar = searchString[nextIndex];
                    
                    // 遇到更深层次的（）
                    if (nextChar === '(') {
                        blockLevel++;
                    }
                    else if (nextChar === ')') { 
                        blockLevel--;

                        // 就是它了，最外层的）                        
                        if (blockLevel === 0) {
                            wordIndex = nextIndex;
                            break;
                        }
                    }

                    nextIndex++;
                }
            }

            let word = searchString.substring(wordIndex, wordIndex + 3).trim();
            // 遇到condition逻辑语句，嗯，就是它了
            if (this.conditions.indexOf(word) >= 0) { 
                let leftPart = searchString.substring(0, wordIndex);
                let rightPart = searchString.substring(wordIndex + 3);

                searchGroup = [leftPart.trim(), word, rightPart.trim()];

                return searchGroup;
            }

            wordIndex++;   
        }

        return searchGroup;
    }
}

module.exports = SearchString;