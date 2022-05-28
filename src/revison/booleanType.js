const { buildFieldDetailBytes } = require("./common")
const fieldType = require("./fieldType")

function BooleanType(f_id, repeated){
    this._id = f_id;
    //this._default = defaultVal;
    if(repeated){
        this._fieldDetailBytes_false = buildFieldDetailBytes(f_id, fieldType.NO);
    }else{
        this._fieldDetailBytes_false = [];//in case of object property false value need not be encoded
    }
    this._fieldDetailBytes_true = buildFieldDetailBytes(f_id, fieldType.YES);
}

BooleanType.prototype.encode = function(v){
    if(v === false){
        return Buffer.from( this._fieldDetailBytes_false[0] );
    }else if(!v){
        return [];
    }else{
        return Buffer.from( this._fieldDetailBytes_true[0] );
    }
};

BooleanType.prototype._decode = function(v,i){
    return {
        index: i+1,
        value: this._decodeChar[ v[i] ]
    }
};

module.exports = BooleanType;