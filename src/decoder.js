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
        switch(schema.type.value){
            case dataType.ARRAY.value:
                if(this.currentChar() === chars.emptyChar){
                    this.index++;
                    return [];
                }else if(this.currentChar() !== chars.arrStart){
                    throw Error("Parsing error: Array start char was expcted");
                }else{
                    this.index++;//skip array start char
                    var itemSchema = schema.properties; //schema of array item
                    var item = getKey(itemSchema,0);
                    var obj = []
                    do{
                        var r =  this._d(item) ;
                        if(r !== undefined){
                            obj.push(r);
                        }
                    }while(this.dataToDecode[this.index] === chars.arraySepChar && ++this.index);
                    return obj;
                }
            case dataType.OBJECT.value:
                if(this.currentChar() === chars.emptyChar){
                    this.index++;
                    return {};
                }else if(this.currentChar() !== chars.objStart){
                    throw Error("Parsing error: Object start char was expcted");
                }else{
                    this.index++;//skip object start char
                    var keys = Object.keys(schema.properties);
                    var obj = {};
                    //var item = getKey(schema,0);
                    for(var i in keys){
                        var r =  this._d(schema.properties[keys[i]]) ;
                        if(r !== undefined){
                            obj[keys[i]] = r;
                        }
                    }
                    return obj;
                }
            default://premitive
                return this.readPremitiveValue(schema);
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
    
    return schemaOfCurrentKey.type.parseBack(val);
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
    if(!objStr || typeof objStr !== "string" || objStr.length === 0) throw Error("input should be a valid string");
    this.dataToDecode = objStr;
    return this._d(this.schema);
}

function decoder(schema){
    this.schema = schema;
    this.index= 0;
}
module.exports= decoder;