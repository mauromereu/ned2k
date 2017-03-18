const UsualPacket = require('../UsualPacket');
const SearchString = require('./SearchString');

const OPCODE = 0X0;

const TYPE = {
    ANY: 0x0,
};

class SearchRequest extends UsualPacket{
    constructor({originString = '',}){
        super();
        this.searchString = new SearchString(originString);
    }

    encode(){
        let infixStrExp = this.searchString.formatSearchString().split(' ');
        
    }

    static get OPCODE(){
        return OPCODE;
    }

    static get TYPE(){
        return TYPE;
    }
}

module.exports = SearchRequest;