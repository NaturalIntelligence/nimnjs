var DataType = require("./common").DataType;
var chars = require("./common").chars;
var startsWithNimnChar = require("./common").startsWithNimnChar;

function MapType(fName){
    this._name = fName;
    this._type = DataType.MAP;
    this._keys = [];
    this._len = 0;
}

MapType.prototype._encode = function(v){
    if(v === undefined){
        return chars.missingChar;
    }else if(v === null){
        return chars.nilChar;
    }else if(Object.keys(v).length === 0){
        return chars.emptyChar;
    }else {
        var str = this._keys[0]._encode( v[ this._keys[0]._name ] );
        var wasNimnChar = startsWithNimnChar(str,this._keys[0]);
        for(var i=1; i < this._len; i++){
            var newStr = this._keys[i]._encode( v[ this._keys[i]._name ] );
            var isNimnChar = startsWithNimnChar(newStr,this._keys[i]);
            if( isNimnChar || wasNimnChar ){
                str += newStr;
            }else{
                str += `${chars.boundaryChar}${newStr}`;
            }
            wasNimnChar = isNimnChar;
        }
        return `${chars.objStart}${str}${chars.objEnd}`;
    }
};

MapType.prototype._decode = function(v,i){
    if(v[i] === chars.emptyChar){
        return {index: i+1, value: {} };
    }else if(v[i] === chars.missingChar){
        return {index: i+1, value: undefined };
    }else if(v[i] === chars.nilChar){
        return {index: i+1, value: null }
    }else if(v[i] === chars.objStart){
        i++;
        var currentObj = {};
        var str = this._keys[0]._decode( v,i );
        i = str.index;
        if(str.value !== undefined){
            currentObj[ this._keys[ 0 ]._name ] = str.value;
        }
        for(var key_i=1; key_i < this._len && v[i] !== chars.objEnd; key_i++){
            var keyVal ;
            if(v[i] === chars.boundaryChar){
                keyVal = this._keys[ key_i ]._decode( v,i +1 );
            }else{
                keyVal = this._keys[ key_i ]._decode( v,i );
            }
            i = keyVal.index;
            if(keyVal.value !== undefined){
                currentObj[ this._keys[ key_i ]._name ] = keyVal.value;
            }
        }
        if(v[i] !== chars.objEnd){
            i = skipUntilThisObjectEnds(v, i);
        }
        return {
            index : i+1,
            value: currentObj
        }
    }else{
        throw Error("Invalid character at position " + i);
    }
};


var skipUntilThisObjectEnds = function(str, from,to){
    to = to || str.length;
    var count = 0;
    for(;from < to; from++){
        if(chars.objStart === str[ from ]) {
            count ++;
        }else if( chars.objEnd === str[ from ] && str[ from -1 ] !== "\\" ){
            if(count === 0) return from;
            else count --;
        }
    }
    return from;
}


module.exports = MapType;