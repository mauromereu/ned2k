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
            return str.indexOf(` ${o} `) < 0;
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

        return this.formatedString.join(' ');
    }

    getConditionIndexFromNotGroupString(notGroupString) {
        for (let key of this.conditions) {
            let index = notGroupString.indexOf(key);
            if (index >= 0 && (notGroupString[index - 1] === ' ' || notGroupString[index + 1] === ' ')) {
                return index;
            }
        }
    }

    formatSearchString(searchString) {
        let wordIndex = 0;
        let searchGroup = [];

        let groupBreakPoint = [];
        let blockLevel = 0;
        let conditionDirection = null;
        searchString = searchString.trim();

        while (wordIndex < searchString.length) {
            let char = searchString[wordIndex];

            // Reach The Logic Block With (), Jump...
            // Search Util reaching )
            // rewrite wordIndex value, keep Time complexity is O(n)
            if (char === '(') {
                let nextIndex = wordIndex + 1;
                blockLevel++;

                while (nextIndex < searchString.length) {
                    let nextChar = searchString[nextIndex];

                    // Reach the deeper（）
                    if (nextChar === '(') {
                        blockLevel++;
                    }
                    else if (nextChar === ')') {
                        blockLevel--;

                        // That's it, the outside )
                        if (blockLevel === 0) {
                            if (wordIndex === 0) {
                                conditionDirection = 'right';
                            }
                            else {
                                conditionDirection = 'left';
                            }

                            groupBreakPoint.push([wordIndex, nextIndex + 1]);
                            wordIndex = nextIndex;
                            break;
                        }
                    }

                    nextIndex++;
                }
            }

            wordIndex++;
        }

        let leftPart = null;
        let rightPart = null;
        let condition = null;
        let conditionIndex = 0;

        let leftCorrection = 0;
        let rightCorrection = 0;

        switch (groupBreakPoint.length) {
            // string AND string
            case 0:    
                conditionIndex = this.getConditionIndexFromNotGroupString(searchString);
                break;

            // (string) AND string 
            // string AND (string)
            case 1:
                let breakPoint = groupBreakPoint[0];
                let breakPointStart = breakPoint[0];
                let breakPointEnd = breakPoint[1];

                if (conditionDirection === 'left') {
                    let searchRange = searchString.substring(0, breakPointStart);
                    conditionIndex = this.getConditionIndexFromNotGroupString(searchRange);
                    rightCorrection++;
                }
                else {
                    let searchRange = searchString.substring(breakPointEnd);
                    conditionIndex = breakPointEnd + this.getConditionIndexFromNotGroupString(searchRange);
                    leftCorrection++;
                }
                break;

            // (string) AND (string)                
            case 2:
                let leftBreakPoint = groupBreakPoint[0];
                let rightBreakPoint = groupBreakPoint[1];

                let leftBreakPointEnd = leftBreakPoint[1];
                let rightBreakPointStart = rightBreakPoint[0];

                leftCorrection++;
                rightCorrection++;

                let searchRange = searchString.substring(leftBreakPointEnd, rightBreakPointStart);
                conditionIndex = leftBreakPointEnd + this.getConditionIndexFromNotGroupString(searchRange);

                break;
        }

        if (conditionIndex < searchString.length) {
            condition = searchString.substring(conditionIndex, conditionIndex + 3).trim();
            leftPart = searchString.substring(0, conditionIndex).trim();
            rightPart = searchString.substring(conditionIndex + 3, searchString.length).trim();

            leftPart = leftPart.slice(leftCorrection, leftPart.length - leftCorrection);
            rightPart = rightPart.slice(rightCorrection, rightPart.length - rightCorrection);

            searchGroup = [leftPart, condition, rightPart];
        } 
        
        return searchGroup;
    }
}

module.exports = SearchString;