var chars = require("./chars");
var valParser = require("./val_parser");

function nimn(schema) {
    this.e_schema = schema;
}

nimn.prototype.encode = function(jObj){
        return this.e(jObj,this.e_schema)
}

function getKey(obj,i){
    return obj[Object.keys(obj)[i]];
}
nimn.prototype.e = function(jObj,e_schema){
    var isData1 = hasData(jObj);
    if(isData1 !== true){
        return isData1;
    }
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
                var itemSchema = getKey(properties[key].properties,0);
                var itemSchemaType = itemSchema.type;
                var arr_len = jObj[key].length;
                str = appendBoundryCharIfNeeded(str,jObj[key][0]);
                for(var arr_i=0;arr_i < arr_len;arr_i++){
                    //if arraySepChar presents, next item is an array item.
                    if(itemSchemaType !== "array" && itemSchemaType !== "object" ){
                        str += checkForNilOrUndefined(jObj[key][arr_i],itemSchemaType);
                    }else{
                        var r =  this.e(jObj[key][arr_i],itemSchema) ;
                        str = processObject(str,r);
                    }
                    if(arr_len > arr_i+1){
                        str += chars.arraySepChar;
                    }
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
                var r = this.e(jObj[key],itemType)
                str = processObject(str,r);
            }else{
                str += isData;
            }
        }else{
            str = appendBoundryCharIfNeeded(str,jObj[key]);
            str += checkForNilOrUndefined(jObj[key],properties[key].type);
        }
    }
    return str;
}

function processObject(str,r){
    if(r === chars.emptyChar && chars.boundryChar  === str[str.length -1]){
        str = str.replace(/.$/,chars.emptyChar);
    }else{
        if(!isAppChar(r[0]) && ( str.length > 0 && !isAppChar(str[str.length-1]))){
            str += chars.boundryChar + r;
        }else{
            str += r;
        }
    }
    return str
}

var checkForNilOrUndefined= function(a,type){
    if(a === undefined || a === null) return chars.nilPremitive;
    else return parseValue(a,type);
}

var parseValue = function(val,type){
    if(type === "string") return val;
    else if(type === "boolean") return valParser.parseBoolean(val);
    else if(type === "number") return val;
    else if(type === "date") return val;
    else return val;
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
    if( str.length > 0 && !isAppChar(str[str.length -1]) &&  !isNonDataValue(next) ){
            str += chars.boundryChar;
    }
    return str;
}

//TODO: change name
function isNonDataValue(ch){
    return ch === null 
    || ch === undefined 
    || ( typeof ch === "object" && ch.length === 0 )
    || ch === true
    || ch === false;
}

//TODO: convert into array for fast comparision
function isAppChar(ch){
    return ch === chars.nilChar ||  ch === chars.nilPremitive
     ||  ch === chars.boundryChar 
     || ch === chars.emptyChar
     || ch === chars.yesChar
     || ch === chars.noChar
     || ch === chars.arraySepChar;
}



module.exports = nimn;