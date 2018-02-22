var chars = require("./chars").chars;
var valParser = require("./val_parser");
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
                        var result = _d(objStr,index,itemSchema);
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

exports.decode= _d;