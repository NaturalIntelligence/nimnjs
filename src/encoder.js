var chars = require("./chars").chars;
var getKey = require("./util").getKey;
var dataType = require("./schema").dataType;
var charsArr = require("./chars").charsArr;

var encode = function(jObj,e_schema){
    if(e_schema.type.value > 4){
        //case dataType.ARRAY.value:
        //case dataType.OBJECT.value:

            var hasValidData = hasData(jObj);
            if(hasValidData === true){
                var str = "";
                if(e_schema.type.value === 6){
                    str += chars.arrStart;
                    var itemSchema = getKey(e_schema.properties,0);
                    //var itemSchemaType = itemSchema.type;
                    var arr_len = jObj.length;
                    for(var arr_i=0;arr_i < arr_len;){
                        var r;
                        /* if(itemSchema.type.value < 5 ){//comment to avoid recursion
                            r =  getValue(jObj[arr_i],itemSchema.type);
                        }else{ */
                            r =  encode(jObj[arr_i],itemSchema) ;
                        //}
                        str = processValue(str,r);
                        if(arr_len > ++arr_i){
                            str += chars.arraySepChar;
                        }
                    }
                }else{//object
                    str += chars.objStart;
                    var keys = Object.keys(e_schema.properties);
                    for(var i in keys){
                        var r;
                        /* if(e_schema.properties[keys[i]].type.value < 5 ){//comment to avoid recursion
                            r =  getValue(jObj[keys[i]],e_schema.properties[keys[i]].type);
                        }else { */
                            r =  encode(jObj[keys[i]],e_schema.properties[keys[i]]) ;
                        //}
                        str = processValue(str,r);
                    }
                }
                return str;
            }else{
                return hasValidData;
            }
    }else{//premitive
        return getValue(jObj,e_schema.type);
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

var checkForNilOrUndefined= function(a,type){
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

var nonDataArr = [null, undefined, true, false]
function isNonDataValue(ch){
    return nonDataArr.indexOf(ch) !== -1 || ( typeof ch === "object" && ch.length === 0 );
}

function isAppChar(ch){
    return charsArr.indexOf(ch) !== -1;
}

exports.encode= encode;