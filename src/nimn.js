var chars = require("./chars").chars;
var charsArr = require("./chars").charsArr;
var valParser = require("./val_parser");
var dataType = require("./schema").dataType;

function nimn(schema) {

    updateDataType(schema);

    this.e_schema = schema;
}

function updateDataType(schema,lastfieldSchema){
    schema.type = dataType.getType(schema.type);
    var properties = schema.properties;
    var keys = Object.keys(properties);
    var lastFieldSchemaToSet;
    var len = keys.length;
    for(var i=0; i< len; i++){
        var key = keys[i];
        var nextKey = keys[i+1];
        var schemaOfLastKey = properties[keys[i-1]];
        var schemaOfCurrentKey = properties[key];
        var schemaOfNextKey = properties[nextKey];
        if(isArrayOrObject(schemaOfCurrentKey)){
            if(schemaOfLastKey && isArrayOrObject(schemaOfLastKey) && lastFieldSchemaToSet){
                lastFieldSchemaToSet = updateDataType(schemaOfCurrentKey,lastFieldSchemaToSet);
            }else{
                lastFieldSchemaToSet = updateDataType(schemaOfCurrentKey,schemaOfLastKey);
            }
            if(schemaOfNextKey === undefined){
                return lastFieldSchemaToSet;
            }else{
                setReadUntil(lastFieldSchemaToSet,schemaOfNextKey);
            }
        }else{
            if( i===0 && lastfieldSchema){
                setReadUntil(lastfieldSchema,schemaOfCurrentKey);
            }
            schemaOfCurrentKey.type = dataType.getType(schemaOfCurrentKey.type);
            if(schemaOfNextKey === undefined){
                return schemaOfCurrentKey;//in the hope someone down the floor will set it up
            }else{
                setReadUntil(schemaOfCurrentKey,schemaOfNextKey);
            }
        }
    }
}

function isArrayOrObject(schema){
    return schema.type === "array" || schema.type === "object"
    || schema.type === dataType.ARRAY || schema.type === dataType.OBJECT;
}

function setReadUntil(current,next){
    if(current.type === "boolean" || current.type === dataType.BOOLEAN){
        //do nothing
    }else{
        if(next.type === "boolean" || next.type === dataType.BOOLEAN){
            (current.readUntil = current.readUntil || []).push(chars.yesChar, chars.noChar);
        }else if(next.type === "object" || next.type === dataType.OBJECT
            || next.type === "array" || next.type === dataType.ARRAY){
                (current.readUntil = current.readUntil || []).push(chars.nilChar, chars.emptyChar);
        }else{
            (current.readUntil = current.readUntil || []).push(chars.boundryChar);
        }
    }
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
        if(properties[key].type === dataType.ARRAY){
            var isData = hasData(jObj[key]);
            if(isData === true){
                var itemSchema = getKey(properties[key].properties,0);
                var itemSchemaType = itemSchema.type;
                var arr_len = jObj[key].length;
                str = appendBoundryCharIfNeeded(str,jObj[key][0]);
                for(var arr_i=0;arr_i < arr_len;arr_i++){
                    //if arraySepChar presents, next item is an array item.
                    if(itemSchemaType !== dataType.ARRAY && itemSchemaType !== dataType.OBJECT ){
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
        }else if(properties[key].type === dataType.OBJECT){
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
    if(type === dataType.STRING) return val;
    else if(type === dataType.BOOLEAN) return valParser.parseBoolean(val);
    else if(type === dataType.NUMBER) return val;
    else if(type === dataType.DATE) return val;
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

var nonDataArr = [null, undefined, true, false]
function isNonDataValue(ch){
    return nonDataArr.indexOf(ch) !== -1 
    || ( typeof ch === "object" && ch.length === 0 );
}

function isAppChar(ch){
    return charsArr.indexOf(ch) !== -1;
}

module.exports = nimn;