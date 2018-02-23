var chars = require("./chars").chars;
var dataType = require("./schema").dataType;
var getKey = require("./util").getKey;

var _d = function(objStr,index,schema){
    var properties = schema.properties;
    var keys = Object.keys(properties);
    var len = keys.length;
    var obj = {}
    for(var i=0; i< len; i++){
        var key = keys[i];
        var nextKey = keys[i+1];
        var schemaOfCurrentKey = properties[key];
        if(schemaOfCurrentKey.type.value === dataType.ARRAY.value){
            if(objStr[index] === chars.nilChar){
                index++;
            }else if(objStr[index] === chars.emptyChar){
                obj[key] = [];
                index++;
            }else{
                do{
                    var itemSchema = schemaOfCurrentKey.properties; //schema of array item
                    if(itemSchema.properties){
                        var result = _d(objStr,index,itemSchema);
                        index = result.index;
                        if(result.val !== undefined){
                            (obj[key] = obj[key] || []).push(result.val);
                        }
                    }else{
                        index = processPremitiveValue(obj,key,objStr,index,getKey(itemSchema,0),true);
                    }   
                    
                }while(objStr[index] === chars.arraySepChar && ++index);
            }
        }else if(schemaOfCurrentKey.type.value === dataType.OBJECT.value){
            if(objStr[index] === chars.nilChar){
                index++;
            }else if(objStr[index] === chars.emptyChar){
                obj[key] = {};
                index++;
            }else{
                var result = _d(objStr,index,schemaOfCurrentKey);
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

function processPremitiveValue(obj,key,objStr,index,schemaOfCurrentKey,isArray){
    var val = "";
    if(schemaOfCurrentKey.readUntil){
        val = readFieldValue(objStr,index,schemaOfCurrentKey.readUntil);
    }else{
        val = objStr[index];
    }
    index+=val.length;
    if(objStr[index] === chars.boundryChar) index++;
    if(val !== chars.nilPremitive){
        schemaOfCurrentKey.type.parseBack(val,function(result){
            if(isArray){
                (obj[key] = obj[key] || []).push(result);
            }else{
                obj[key] = result;
            }
        });
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

var decode = function(objStr,schema){
    if(!objStr || typeof objStr !== "string" || objStr.length === 0) throw Error("input should be a valid string");
    if(objStr.length === 1){
        if(objStr === chars.emptyChar){
            return {};
        }else if(objStr === chars.nilChar){
            return undefined;
        }
    } 
    return _d(objStr,0,schema).val;
}

exports.decode= decode;