var DataType = require("./common").DataType;
var chars = require("./common").chars;
var startsWithNimnChar = require("./common").startsWithNimnChar;


function ListType(fName){
    this._name = fName;
    this._type = DataType.LIST;
    this._item = null;
}

ListType.prototype._encode = function (v){
    if(v === undefined){
        return chars.missingChar;
    }else if(v === null){
        return chars.nilChar;
    }else if(v.length === 0){
        return chars.emptyChar;
    }else {
        var len = v.length;
        var str = this._item._encode( v[ 0 ] );
        var wasNimnChar = startsWithNimnChar(str,this._item);
        for(var i=1; i < len; i++){
            var newStr = this._item._encode( v[ i ] );
            var isNimnChar = startsWithNimnChar(newStr,this._item);
            if( isNimnChar || wasNimnChar ){
                str += newStr;
            }else{
                str += `${chars.boundaryChar}${newStr}`;
            }
            wasNimnChar = isNimnChar;
        }
        return `${chars.arrStart}${str}${chars.arrEnd}`;
    }
};

ListType.prototype._decode = function(v,i){
    if(v[i] === chars.emptyChar){
        return {index: i+1, value: []};
    }else if(v[i] === chars.missingChar){
        return {index: i+1, value: undefined };
    }else if(v[i] === chars.nilChar){
        return {index: i+1, value: null }
    }else if(v[i] === chars.arrStart){
        i++;
        var currentArr = [];
        var str = this._item._decode( v,i );
        i = str.index;
        if(str.value !== undefined)
            currentArr.push(str.value);
        
        for( ; v[i] !== chars.arrEnd ;){
            var itemVal;
            if(v[i] === chars.boundaryChar){
                itemVal = this._item._decode( v,i +1 );
            }else{
                itemVal = this._item._decode( v,i );
            }
            i = itemVal.index;
            if(itemVal.value !== undefined)
                currentArr.push(itemVal.value);
        }

        return {
            index : i+1,
            value: currentArr
        }
    }else{
        throw Error("Invalid character at position " + i);
    }
};

module.exports = ListType;