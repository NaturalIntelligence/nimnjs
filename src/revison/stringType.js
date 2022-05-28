const { buildFieldDetailBytes } = require("./common")
const fieldType = require("./fieldType")

class StringType{
    constructor(id){
        this._id = id;
        //this._default = defaultVal;
        this._fieldDetailBytes = Buffer.from( buildFieldDetailBytes(id, fieldType.HAS_DATA_LENGTH) );
    }
    
    encode(v){
        if(v !== "" && !v) return [];
        var fieldLengthBytes = lengthToBytes(v.length);
        return [ this._fieldDetailBytes, fieldLengthBytes, Buffer.from(v)];
    };

}

/* 
StringType.prototype._decode = function(v,i){
    if( inRange(v[i])){
        return {
            index: i+1,
            value: this._decodeChar[ v[i] ]
        }
    }else{
        var nextIndex = read(v,i);
        return { index: nextIndex, value: this._removeBackspace( v.substring(i,nextIndex) )};
    }
};
 */
module.exports = StringType;