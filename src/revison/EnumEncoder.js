const { buildFieldDetailBytes } = require("./common")

class EnumEncoder{
    constructor(id){
        this._id = id;
        this._fieldDetailBytes = Buffer.from( buildFieldDetailBytes(id, 4) );
    }

    /**
    * validate and encode
    * @param {string | number} val 
    */
    encode(val){//TODO create a method without validation
        if( this._keys.indexOf(val) !== -1){
            if(typeof val === 'string' && val.length == 1){
                return [ this._fieldDetailBytes, Buffer.from( [ val.charCodeAt(0) ] ) ];
            }else if( val < 127){//number
                return [ this._fieldDetailBytes, Buffer.from( [ val ] ) ];
            }
        }
        throw Error("Invalid value for Enum.");
    }
}

module.exports = EnumEncoder;