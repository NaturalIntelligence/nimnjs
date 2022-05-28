var DataType = require("./common").DataType;
var chars = require("./common").chars;
var startsWithNimnChar = require("./common").startsWithNimnChar;
var read = require("./common").read;

function VarMapType(fName){
    this._name = fName;
    this._type = DataType.VARMAP;
    this._item = null;
}

VarMapType.prototype._encode = function (v){
    if(v === undefined){
        return chars.missingChar;
    }else if(v === null){
        return chars.nilChar;
    }else if(Object.keys(v).length === 0){
        return chars.emptyChar;
    }else {
        var keys = Object.keys(v);
        var len = keys.length;
        var str =  this._item._encode( v[ keys[0] ] );
        var wasNimnChar = startsWithNimnChar(str,this._item);
        str = keys[0] + chars.fieldNameBoundaryChar + str;

        for(var i=1; i < len; i++){
            var newStr = this._item._encode( v[ keys[i] ] );
            var isNimnChar = startsWithNimnChar(newStr,this._item);
            newStr = keys[i] + chars.fieldNameBoundaryChar + newStr;

            if( wasNimnChar ){
                str += newStr;
            }else{
                str += `${chars.boundaryChar}${newStr}`;
            }
            wasNimnChar = isNimnChar;
        }
        return `${chars.arrStart}${str}${chars.arrEnd}`;
    }
};

VarMapType.prototype._decode = function(v,i){
    if(v[i] === chars.emptyChar){
        return {index: i+1, value: {}};
    }else if(v[i] === chars.missingChar){
        return {index: i+1, value: undefined };
    }else if(v[i] === chars.nilChar){
        return {index: i+1, value: null }
    }else if(v[i] === chars.arrStart){
        i++;
        var currentObj = {};
        //get the index of first chars.fieldNameBoundaryChar after i
        var indexOfFieldSeparator = read(v,i);
        var fieldName = v.substring( i, indexOfFieldSeparator );
        i = indexOfFieldSeparator + 1;
        var str = this._item._decode( v,i );
        i = str.index;
        if(str.value !== undefined)
            currentObj[fieldName] = str.value;
        
        for( ; v[i] !== chars.arrEnd ;){
            var itemVal;
            if(v[i] === chars.boundaryChar){
                i++;
            }
            var indexOfFieldSeparator = read(v,i);
            var fieldName = v.substring( i, indexOfFieldSeparator );
            i = indexOfFieldSeparator + 1;
            itemVal = this._item._decode( v,i );
            i = itemVal.index;
            if(itemVal.value !== undefined)
                currentObj[fieldName] = itemVal.value;
        }

        return {
            index : i+1,
            value: currentObj
        }
    }else{
        throw Error("Invalid character at position " + i);
    }
};


module.exports = VarMapType;