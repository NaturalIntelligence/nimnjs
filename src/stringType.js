var DataType = require("./common").DataType;
var chars = require("./common").chars;
var char = require("./common").char;
var sanitize = require("./common").sanitize;
var removeBackspace = require("./common").removeBackspace;
var inRange = require("./common").inRange;
var read = require("./common").read;

function StringType(fName, defaultVal, shouldSanitize){
    this._name = fName;
    this._type = DataType.STRING;
    this._sanitize = shouldSanitize ? sanitize : doNothing;
    this._removeBackspace = shouldSanitize ? removeBackspace : doNothing;

    this._decodeChar = {};
    this._decodeChar[char(175)] = null;
    this._decodeChar[char(184)] = defaultVal;
    this._decodeChar[char(177)] = "";
}
StringType.prototype._encode = function (v){
        if(v){
            v = "" + v;
            return this._sanitize(v);
        }else if(v === undefined){
            return chars.missingPremitive;
        }else if(v === null){
            return chars.nilPremitive;
        }else if(v === ""){
            return chars.emptyPremitive;
        }else{
            v = "" + v;
            return this._sanitize(v);
        }
    };
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

function doNothing(a){
    return a;
}

module.exports = StringType;