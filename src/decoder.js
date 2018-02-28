var chars = require("./chars").chars;
var getKey = require("./util").getKey;
var dataType = require("./schema").dataType;

decoder.prototype._d = function(schema){
    if(this.currentChar() === chars.nilChar || this.currentChar() === chars.nilPremitive){
        this.index++;
        return null;
    }else if(this.currentChar() === chars.missingChar || this.currentChar() === chars.missingPremitive){
        this.index++;
        return undefined;
    }else{
        if(typeof schema.value === "string"){//premitive
            return this.readPremitiveValue(schema);
        }else{
            if(Array.isArray(schema)){
                if(this.currentChar() === chars.emptyChar){
                    this.index++;
                    return [];
                }else if(this.currentChar() !== chars.arrStart){
                    throw Error("Parsing error: Array start char was expected");
                }else{
                    this.index++;//skip array start char
                    var item = schema[0];
                    var obj = []
                    do{
                        var r =  this._d(item) ;
                        if(r !== undefined){
                            obj.push(r);
                        }
                    }while(this.dataToDecode[this.index] === chars.arraySepChar && ++this.index);
                    return obj;
                }
            }else{//object
                if(this.currentChar() === chars.emptyChar){
                    this.index++;
                    return {};
                }else if(this.currentChar() !== chars.objStart){
                    throw Error("Parsing error: Object start char was expected");
                }else{
                    this.index++;//skip object start char
                    var keys = Object.keys(schema);
                    var obj = {};
                    //var item = getKey(schema,0);
                    for(var i in keys){
                        var r =  this._d(schema[keys[i]]) ;
                        if(r !== undefined){
                            obj[keys[i]] = r;
                        }
                    }
                    return obj;
                }
            }
        }
    }

}

/**
 * returns character index pointing to
 */
decoder.prototype.currentChar = function(){
    return this.dataToDecode[this.index];
}

decoder.prototype.readPremitiveValue = function(schemaOfCurrentKey){
    var val = "";
    if(schemaOfCurrentKey.readUntil){
        val = this.readFieldValue(schemaOfCurrentKey.readUntil);
    }else{
        val = this.currentChar();
        this.index += val.length;
    }
    if(val === chars.emptyValue){
        val = "";
    }
    if(this.currentChar() === chars.boundryChar) this.index++;
    var dh = this.dataHandlers[schemaOfCurrentKey.value];
    return dh.parseBack(val);
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
    
    for(;this.index < len && until.indexOf(this.dataToDecode[this.index]) === -1;this.index++ );
    return this.dataToDecode.substr(start, this.index-start);
    
}


decoder.prototype.decode = function(objStr){
    this.index= 0;
    if(!objStr || typeof objStr !== "string" || objStr.length === 0) throw Error("input should be a valid string");
    this.dataToDecode = objStr;
    return this._d(this.schema);
}

function decoder(schema,dataHandlers,charArr){
    this.schema = schema;
    this.handledChars = charArr;
    this.dataHandlers = dataHandlers;
    
}
module.exports = decoder;