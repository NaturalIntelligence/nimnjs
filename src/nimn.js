var chars = require("./chars");

function nimn(schema) {
    this.e_schema = schema;
}

var checkForNilOrUndefined= function(a){
    if(a === undefined || a === null) return chars.nilPremitive;
    else return a;
}


nimn.prototype.encode = function(jObj){
    var isData = hasData(jObj);
    if(isData === true){
        return this.e(jObj,this.e_schema)
    }else{
        return isData;
    }
}

nimn.prototype.e = function(jObj,e_schema){
    var properties = e_schema.properties;
    var keys = Object.keys(properties);
    var len = keys.length;
    
    var str = "";
    for(var i=0; i< len; i++){
        var key = keys[i];
        var nextKey = keys[i+1];
        if(properties[key].type === "array"){
            var isData = hasData(jObj[key]);
            if(isData === true){
                var itemType = properties[key].properties[Object.keys(properties[key].properties)[0]];
                var arr_len = jObj[key].length;
                for(var arr_i=0;arr_i < arr_len;arr_i++){
                    //if arraySepChar presents, next item is an array item.
                    str += chars.arraySepChar + this.e(jObj[key][arr_i],itemType) ;
                    /* if(arr_len > arr_i+1){
                        str += chars.arraySepChar;
                    } */
                }
                str = appendBoundryCharIfNeeded(str);
            }else{
                str += isData;
            }
        }else if(properties[key].type === "object"){
            var isData = hasData(jObj[key]);
            if(isData === true){
                var itemType = properties[key];
                //boundry chars is needed for decoding
                str = appendBoundryCharIfNeeded(str);
                str += this.e(jObj[key],itemType);
                //str = appendBoundryCharIfNeeded(str);
            }else{
                str += isData;
            }
        }else{
            str = appendBoundryCharIfNeeded(str,jObj[key]);
            str += checkForNilOrUndefined(jObj[key]);
        }
    }
    return str;
}

/**
 * Check if the given object is empty, null, or undefined. Returns true otherwise.
 * @param {*} jObj 
 */
function hasData(jObj){
    if(jObj === undefined || jObj === null){
        return chars.nilChar;
    }else  if( jObj.length === 0 || Object.keys(jObj).length === 0){
        return chars.emptyChar;
    }else{
        return true;
    }
}

/**
 * Append Boundry char if last char or next char are not null/missing/empty char
 * @param {*} str 
 */
function appendBoundryCharIfNeeded(str,next){
    if( 
        str.length > 0 && !isNonDataChar(str[str.length -1])
        &&  !isNonDataValue(next) 
    ){
            str += chars.boundryChar;
    }
    return str;

}

function isNonDataValue(ch){
    return ch === null || ch === undefined || ( typeof ch === "object" && ch.length === 0 );
}

function isNonDataChar(ch){
    return ch === chars.nilChar ||  ch === chars.nilPremitive
     ||  ch === chars.boundryChar 
     || ch === chars.emptyChar;
}

module.exports = nimn;