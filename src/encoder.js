var chars = require("./chars").chars;
var getKey = require("./util").getKey;
var dataType = require("./schema").dataType;
var DataType = require("./schema").DataType;
var charsArr = require("./chars").charsArr;

var encode = function(jObj,e_schema){
    if(typeof e_schema.parse === "function"){//premitive
        return getValue(jObj,e_schema);
    }else{
        var hasValidData = hasData(jObj);
        if(hasValidData === true){
            var str = "";
            if(Array.isArray(e_schema)){
                str += chars.arrStart;
                var itemSchema = e_schema[0];
                //var itemSchemaType = itemSchema;
                var arr_len = jObj.length;
                for(var arr_i=0;arr_i < arr_len;){
                    var r =  encode(jObj[arr_i],itemSchema) ;
                    str = processValue(str,r);
                    if(arr_len > ++arr_i){
                        str += chars.arraySepChar;
                    }
                }
            }else{//object
                str += chars.objStart;
                var keys = Object.keys(e_schema);
                for(var i in keys){
                    var key = keys[i];
                    var r =  encode(jObj[key],e_schema[key]) ;
                    str = processValue(str,r);
                }
            }
            return str;
        }else{
            return hasValidData;
        }
    }
}

function processValue(str,r){
    if(!isAppChar(r[0]) && !isAppChar(str[str.length -1])){
        str += chars.boundryChar;
    }
    return str + r;
}

var getValue= function(a,type){
    if(a === undefined) return chars.missingPremitive;
    else if(a === null) return chars.nilPremitive;
    else if( a === "") return chars.emptyValue;
    else return type.parse(a);
}

/**
 * Check if the given object is empty, null, or undefined. Returns true otherwise.
 * @param {*} jObj 
 */
function hasData(jObj){
    if(jObj === undefined) return chars.missingChar;
    else if(jObj === null) return chars.nilChar;
    else  if( jObj.length === 0 || Object.keys(jObj).length === 0){
        return chars.emptyChar;
    }else{
        return true;
    }
}

function isAppChar(ch){
    return charsArr.indexOf(ch) !== -1;
}

exports.encode= encode;