var DataType = require("./common").DataType;
var chars = require("./common").chars;
var char = require("./common").char;
var inRange = require("./common").inRange;
var read = require("./common").read;

function NumberType(fName, defaultVal){
    this._name = fName;
    this._type = DataType.NUMBER;

    this._decodeChar = {};
    this._decodeChar[char(175)] = null;
    this._decodeChar[char(184)] = defaultVal;
}
NumberType.prototype._encode = function(v){
        if(v === undefined){
            return chars.missingPremitive;
        }else if(v === null){
            return chars.nilPremitive;
        }else {
            return v;
        }

        //return numberValues[v] || v;
    };
    
NumberType.prototype._decode = function(v,i){
        if( inRange(v[i]) ){
            return {
                index: i+1,
                value: this._decodeChar[ v[i] ]
            }
        }else{
            var nextIndex = read(v,i);
            var val = v.substring(i,nextIndex);
            if(val.indexOf(".") === -1){
                val = Number.parseInt(val);
            }else{
                val = Number.parseFloat(val);
            }
            return { index: nextIndex, value: val};
        }
    };

module.exports = NumberType;