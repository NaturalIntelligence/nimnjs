var chars = require("./chars").chars;
var charsArr = require("./chars").charsArr;
var valParser = require("./val_parser");
var dataType = require("./schema").dataType;
var updateSchema = require("./schema_updater").updateSchema;

function nimn(schema) {
    updateSchema(schema);
    this.e_schema = schema;
}

nimn.prototype.encode = function(jObj){
        return this._e(jObj,this.e_schema)
}

function getKey(obj,i){
    return obj[Object.keys(obj)[i]];
}
nimn.prototype._e = function(jObj,e_schema){
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
                        var r =  this._e(jObj[key][arr_i],itemSchema) ;
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
                var r = this._e(jObj[key],itemType)
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
    else return valParser.parse[type](a);
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
            index = processPremitiveValue(obj,key,objStr,index,schemaOfCurrentKey);
        }
    }
    return { index: index, val: obj};
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