var DataType = require("./common").DataType;
var chars = require("./common").chars;
var char = require("./common").char;

function BooleanType(fName, defaultVal){
    this._name = fName;
    this._type = DataType.BOOLEAN;

    this._decodeChar = {};
    this._decodeChar[char(175)] = null;
    this._decodeChar[char(184)] = defaultVal;
    this._decodeChar[char(181)] = true;
    this._decodeChar[char(183)] = false;
}

BooleanType.prototype._encode = function(v){
    if(v){
        return chars.yes;
    }else if(v === false){
        return chars.no;
    }else if(v === undefined){
        return chars.missingPremitive;
    }else if(v === null){
        return chars.nilPremitive;
    }
    //return booleanValues[v];
};

BooleanType.prototype._decode = function(v,i){
    return {
        index: i+1,
        value: this._decodeChar[ v[i] ]
    }
};

module.exports = BooleanType;