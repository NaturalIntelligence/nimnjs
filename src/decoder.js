var chars = require("./chars").chars;
var dataType = require("./schema").dataType;
var getKey = require("./util").getKey;

decoder.prototype._d = function(schema){
    var properties = schema.properties;
    var keys = Object.keys(properties);
    var len = keys.length;
    var obj = {}
    for(var i=0; i< len; i++){
        var key = keys[i];
        var nextKey = keys[i+1];
        var schemaOfCurrentKey = properties[key];
        if(this.currentChar() === chars.boundryChar/*  || fieldVal === "" */) {
            this.index++; 
        } 
        if(schemaOfCurrentKey.type.value === dataType.ARRAY.value){
            var itemSchema = schemaOfCurrentKey.properties; //schema of array item
            var item = getKey(itemSchema,0);
            if(this.currentChar() === chars.nilChar){
                this.index++;
            }else if(this.currentChar() === chars.emptyChar){
                obj[key] = [];
                this.index++;
            }else if(this.currentChar() !== chars.arrStart){
                throw Error("Parsing error: Array start char was expcted");
            }else{
                this.index++;
                obj[key] = []
                do{
                    if(item.properties){
                        this.processObject(item, function(result){
                            obj[key].push(result);
                        });
                    }else{
                        this.processPremitiveValue(obj,key,item,true);
                    }   
                }while(this.currentChar() === chars.arraySepChar && ++this.index);
            }
        }else if(schemaOfCurrentKey.type.value === dataType.OBJECT.value){
            this.processObject(schemaOfCurrentKey, function(result){
                obj[key] = result;
            });
        }else{
            this.processPremitiveValue(obj,key,schemaOfCurrentKey);
        }
    }
    return obj;
}


decoder.prototype.processObject = function(item,callback){
    if(this.currentChar() === chars.nilChar){
        this.index++;
    }else if(this.currentChar() === chars.emptyChar){
        callback({});
        this.index++;
    }else if(this.currentChar() !== chars.objStart){
        throw Error("Parsing error: Object start char was expcted");
    }else{
        this.index++;
        var result = this._d(item);
        if(result !== undefined){
            callback(result);
        }
    }
}

/**
 * returns character index pointing to
 */
decoder.prototype.currentChar = function(){
    return this.dataToDecode[this.index];
}


decoder.prototype.processPremitiveValue = function(obj,key,schemaOfCurrentKey,isArray){
    var val = "";
    if(schemaOfCurrentKey.readUntil){
        val = this.readFieldValue(schemaOfCurrentKey.readUntil);
    }else{
        val = this.dataToDecode[this.index];
        this.index += val.length
    }
    if(val === chars.emptyValue){
        val = "";
    }
    if(this.dataToDecode[this.index] === chars.boundryChar) this.index++;
    if(val !== chars.nilPremitive){
        schemaOfCurrentKey.type.parseBack(val,function(result){
            if(isArray){
                (obj[key] = obj[key] || []).push(result);
            }else{
                obj[key] = result;
            }
        });
    }
}
/**
 * Read characters until app supported char is found
 * @param {string} str 
 * @param {number} i 
 */
decoder.prototype.readFieldValue = function(until){
    var val = "";
    var len = this.dataToDecode.length;
    var start = this.index;
    if(this.dataToDecode[start] === chars.nilPremitive){
        this.index++;
        return chars.nilPremitive;
    }else{
        for(;this.index < len && until.indexOf(this.dataToDecode[this.index]) === -1;this.index++ );
        return this.dataToDecode.substr(start, this.index-start);
    }
    
}


decoder.prototype.decode = function(objStr){
    if(!objStr || typeof objStr !== "string" || objStr.length === 0) throw Error("input should be a valid string");
    if(objStr.length === 1){
        if(objStr === chars.emptyChar){
            return {};
        }else if(objStr === chars.nilChar){
            return undefined;
        }
    } 
    this.dataToDecode = objStr;
    return this._d(this.schema);
}

function decoder(schema){
    this.schema = schema;
    this.index= 0;
}
module.exports= decoder;