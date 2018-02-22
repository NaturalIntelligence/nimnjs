var chars = require("./chars").chars;
var charsArr = require("./chars").charsArr;
var valParser = require("./val_parser");
var dataType = require("./schema").dataType;

function nimn(schema) {

    var lastFieldSchemaToSet = updateDataType(schema);
    setReadUntil(lastFieldSchemaToSet,{});
    this.e_schema = schema;
}

/**
 * Update schema type with equivalent dataType key for for fast processing. 
 * Update each field in schema to be aware with next field for fast and easy decoding.
 * @param {*} schema 
 * @param {*} lastfieldSchema 
 */
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
                var isArray = schemaOfCurrentKey.type === "array" || schemaOfCurrentKey.type === dataType.ARRAY;
                setReadUntil(lastFieldSchemaToSet,schemaOfNextKey,isArray);
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

function setReadUntil(current,next,isArray){
    if(current.type === "boolean" || current.type === dataType.BOOLEAN){
        //do nothing
    }else{
        if(next.type === "boolean" || next.type === dataType.BOOLEAN){
            (current.readUntil = current.readUntil || []).push(chars.yesChar, chars.noChar, chars.nilPremitive);
        }else if(isArrayOrObject(next)){
                (current.readUntil = current.readUntil || []).push(chars.nilChar, chars.emptyChar);
        }else{
            (current.readUntil = current.readUntil || []).push(chars.boundryChar, chars.nilPremitive);
        }
        if(isArray) current.readUntil.push (chars.arraySepChar);
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

nimn.prototype.decode = function(objStr,options){
    this.decodingOptions = options;
    return this._d(objStr,0,this.e_schema).val;
}

nimn.prototype._d = function(objStr,index,schema){
    var properties = schema.properties;
    var keys = Object.keys(properties);
    var len = keys.length;
    var obj = {}
    for(var i=0; i< len; i++){
        var key = keys[i];
        var nextKey = keys[i+1];
        var schemaOfCurrentKey = properties[key];
        if(schemaOfCurrentKey.type === dataType.ARRAY){
            if(objStr[index] === chars.nilChar){
                index++;
            }else if(objStr[index] === chars.emptyChar){
                obj[key] = [];
                index++;
            }else{
                do{
                    var itemSchema = schemaOfCurrentKey.properties; //schema of array item
                    if(itemSchema.properties){
                        var result = this._d(objStr,index,itemSchema);
                        index = result.index;
                        if(result.val !== undefined){
                            obj[key] = result.val;
                        }
                    }else{
                        index = processPremitiveValue(obj,key,objStr,index,getKey(itemSchema,0));
                    }   
                    
                }while(objStr[index] === chars.arraySepChar && ++index);
            }
        }else if(schemaOfCurrentKey.type === dataType.OBJECT){
            if(objStr[index] === chars.nilChar){
                index++;
            }else if(objStr[index] === chars.emptyChar){
                obj[key] = {};
                index++;
            }else{
                var result = this._d(objStr,index,schemaOfCurrentKey);
                index = result.index;
                if(result.val !== undefined){
                    obj[key] = result.val;
                }
            }
        }else{
            //read until you find boundry or any app supported char
            /* var val = "";
            if(schemaOfCurrentKey.readUntil){
                val = readFieldValue(objStr,index,schemaOfCurrentKey.readUntil);
            }else{
                val = objStr[index];
            }
            index+=val.length;
            if(objStr[index] === chars.boundryChar) index++;
            if(val !== chars.nilPremitive){
                obj[key] = valParser.unparse[schemaOfCurrentKey.type](val);
            } */
            index = processPremitiveValue(obj,key,objStr,index,schemaOfCurrentKey);
        }
    }
    return { index: index, val: obj};
}

function processObjectValue(){
    
}

function processPremitiveValue(obj,key,objStr,index,schemaOfCurrentKey){
    var val = "";
    if(schemaOfCurrentKey.readUntil){
        val = readFieldValue(objStr,index,schemaOfCurrentKey.readUntil);
    }else{
        val = objStr[index];
    }
    index+=val.length;
    if(objStr[index] === chars.boundryChar) index++;
    if(val !== chars.nilPremitive){
        obj[key] = valParser.unparse[schemaOfCurrentKey.type](val);
    }
    return index;
}
/**
 * Read characters until app supported char is found
 * @param {string} str 
 * @param {number} i 
 */
function readFieldValue(str,from,until){
    var val = "";
    var len = str.length;
    var start = from;
    if(str[start] === chars.nilPremitive){
        return chars.nilPremitive;
    }else{
        for(;from < len && until.indexOf(str[from]) === -1;from++ );
        return str.substr(start, from-start);
    }
    
}
module.exports = nimn;