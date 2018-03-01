var chars = require("./chars").chars;
var getKey = require("./util").getKey;
var dataType = require("./schema").dataType;
var DataType = require("./schema").DataType;
var charsArr = require("./chars").charsArr;

Encoder.prototype._e = function(jObj,e_schema){
    if(typeof e_schema.value === "string"){//premitive
        return this.getValue(jObj,e_schema.value);
    }else{
        var hasValidData = hasData(jObj);
        if(hasValidData === true){
            var str = "";
            if(Array.isArray(e_schema)){
                str += chars.arrStart;
                var itemSchema = e_schema[0];
                //var itemSchemaType = itemSchema;
                var arr_len = jObj.length;
                for(var arr_i=0;arr_i < arr_len;arr_i++){
                    var r = this._e(jObj[arr_i],itemSchema) ;
                    str = this.processValue(str,r);
                    /* if(arr_len > ++arr_i){
                        str += chars.arraySepChar;
                    } */
                }
                str += chars.arraySepChar;//indicates that next item is not array item
            }else{//object
                str += chars.objStart;
                var keys = Object.keys(e_schema);
                for(var i in keys){
                    var key = keys[i];
                    var r =  this._e(jObj[key],e_schema[key]) ;
                    str = this.processValue(str,r);
                }
            }
            return str;
        }else{
            return hasValidData;
        }
    }
}

Encoder.prototype.processValue= function(str,r){
    if(!this.isAppChar(r[0]) && !this.isAppChar(str[str.length -1])){
        str += chars.boundryChar;
    }
    return str + r;
}

/**
 * 
 * @param {*} a 
 * @param {*} type 
 * @return {string} return either the parsed value or a special char representing the value
 */
Encoder.prototype.getValue= function(a,type){
    if(a === undefined) return chars.missingPremitive;
    else if(a === null) return chars.nilPremitive;
    else if( a === "") return chars.emptyValue;
    else return this.dataHandlers[type].parse(a);
    //else return type.parse(a);
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

Encoder.prototype.isAppChar = function(ch){
    return this.handledChars.indexOf(ch) !== -1;
}

Encoder.prototype.encode = function(jObj){
    return this._e(jObj,this.schema);
}

function Encoder(schema,dHandlers, charArr){
    this.dataHandlers = dHandlers;
    this.handledChars = charArr;
    this.schema = schema;
}

module.exports = Encoder;