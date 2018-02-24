var chars = require("./chars").chars;
var dataType = require("./schema").dataType;
var getKey = require("./util").getKey;

decoder.prototype._d = function(schema,fieldVal){
    var properties = schema.properties;
    var keys = Object.keys(properties);
    var len = keys.length;
    var obj = {};
    //var fieldVal = this.readFieldValue();
    for(var i=0; i< len; i++){
        var key = keys[i];
        var nextKey = keys[i+1];
        var schemaOfCurrentKey = properties[key];
        if(fieldVal === chars.boundryChar/*  || fieldVal === "" */) {
            fieldVal = this.readFieldValue();  
        } 
       if(schemaOfCurrentKey.type.value === dataType.ARRAY.value){
            var itemSchema = schemaOfCurrentKey.properties; //schema of array item
            var item = getKey(itemSchema,0);
            if(fieldVal === chars.nilChar ){//don't add any key
            }else if(fieldVal === chars.emptyChar){
                obj[key] = [];
            }else if(fieldVal !== chars.arrStart){
                throw Error("Parsing error: Array start char was expcted");
            }else{
                fieldVal = this.readFieldValue();
                obj[key] = [];
                while(true){
                    
                    if(item.properties){//object or array type
                        if(fieldVal === chars.nilChar ){//don't add any key
                        }else if(fieldVal === chars.emptyChar){
                            obj[key].push({});
                        }else if(fieldVal !== chars.objStart){
                            throw Error("Parsing error: Object start char was expcted");
                        }else{
                            fieldVal = this.readFieldValue();
                            var result = this._d(item,fieldVal);
                            if(result !== undefined){
                                obj[key].push(result);
                            }
                        }
                    }else{
                        this.processPremitiveValue(obj,key,fieldVal,item,true);
                    }
                    fieldVal = this.readFieldValue();
                    if(fieldVal === chars.arraySepChar){//read next array item
                        fieldVal = this.readFieldValue();
                    }else{//next field is not from this array
                        break;
                    }
                }
                continue;
            }
        }else if(schemaOfCurrentKey.type.value === dataType.OBJECT.value){
            var typeOfFirstChild = getKey(schemaOfCurrentKey.properties,0).type;
            if(fieldVal === chars.nilChar ){//don't add any key
            }else if(fieldVal === chars.emptyChar){
                obj[key] = {};
            }else if(fieldVal !== chars.objStart){
                throw Error("Parsing error: Object start char was expcted");
            }else{
                fieldVal = this.readFieldValue();
                obj[key] = {};
                var result = this._d(schemaOfCurrentKey,fieldVal);
                if(result !== undefined){
                    obj[key] = result;
                }
            }
        }else{
            if(fieldVal === chars.emptyChar){
                obj = {};
                break;
            }else if(fieldVal === chars.nilChar){
                obj = undefined;
                break;
            }else{
                this.processPremitiveValue(obj,key,fieldVal,schemaOfCurrentKey);
            }
        }
        if(len === i+1) continue;
        fieldVal = this.readFieldValue();
    }
    return obj;
}

function isArrayOrObject(type){
    return type.value === dataType.OBJECT.value || type.value === dataType.ARRAY.value ;
}

/**
 * Set key value is it is not null
 * @param {*} obj 
 * @param {string} key 
 * @param {string} val 
 * @param {boolean} isArray 
 */
decoder.prototype.processPremitiveValue= function(obj,key,val,schemaOfCurrentKey,isArray){
    /* if(val === ""){
        val = this.readFieldValue();    
    }else  */if(val === chars.emptyValue){
        val = "";
    }
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
 * Read field wise data from the given encoded data
 * @param {string} str 
 * @param {number} i 
 * @returns field value
 */
decoder.prototype.readFieldValue = function(){
    if(this.counter === 0){
        this.lastItem = this.regxResult ;
        this.regxResult = this.fieldRegx.exec(this.dataToDecode);//reads 2 fields at a time
        if(this.regxResult === null)//last unread data
            return this.dataToDecode.substr(this.lastItem.index + this.lastItem[1].length + 1);
        if(this.regxResult[1] === "") 
            return this.regxResult[2];
        this.counter++;
        return this.regxResult[1];//returns 1st captured field
    }else{
        this.counter = 0;
        if(this.regxResult === null) return null;
        return this.regxResult[2];//returns 2nd captured field
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
    return this._d(this.schema,this.readFieldValue());
}

function decoder(schema){
    this.counter = 0;
    this.fieldRegx = new RegExp("(.*?)(["
        + chars.arraySepChar + chars.boundryChar 
        + chars.nilPremitive + chars.nilChar 
        + chars.yesChar + chars.noChar
        + chars.emptyChar + chars.emptyValue
        + chars.objStart + chars.arrStart
        +"])","g")
    this.schema = schema;
}
module.exports= decoder;