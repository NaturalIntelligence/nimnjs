(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.nimn = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
var char = require("./util").char;


/* 176-178
180-190
198-208
219-223
 */

const chars= {
    nilChar : char(254),
    missingChar : char(200),
    nilPremitive : char(176),
    missingPremitive : char(201),
    emptyChar : char(177),
    emptyValue:  char(178),
    yesChar : char(217),
    noChar : char(218),
    boundryChar : char(186),
    arraySepChar: char(197),
    objStart: char(198),
    arrStart: char(199)
}

const charsArr = [
    chars.nilChar ,
    chars.nilPremitive,
    chars.missingChar,
    chars.missingPremitive,
    chars.boundryChar ,
    chars.emptyChar,
    chars.yesChar,
    chars.noChar,
    chars.arraySepChar,
    chars.objStart,
    chars.arrStart
]

exports.chars = chars; 
exports.charsArr = charsArr; 
},{"./util":9}],2:[function(require,module,exports){
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
            break;
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
            break;
            default://premitive
                return this.readPremitiveValue(schema);
        }
    
    }

}


decoder.prototype.processObject = function(obj,key,item,isArr){
    if(this.dataToDecode[this.index] === chars.nilChar){
        this.index++;
    }else if(this.dataToDecode[this.index] === chars.emptyChar){
        if(isArr){
            obj[key].push({});
        }else{
            obj[key] = {};
        }
        this.index++;
    }else if(this.dataToDecode[this.index] !== chars.objStart){
        throw Error("Parsing error: Object start char was expcted");
    }else{
        this.index++;
        var result = this._d(item);
        if(result !== undefined){
            if(isArr){
                obj[key].push(result);
            }else{
                obj[key] = result;
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
    
    return schemaOfCurrentKey.type.parseBack(val);
}


decoder.prototype.processPremitiveValue = function(obj,key,schemaOfCurrentKey,isArr){
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
        var result = schemaOfCurrentKey.type.parseBack(val);
        if(isArr){
            obj[key].push(result);
        }else{
            obj[key] = result;
        }
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
    if(objStr.length === 1 && objStr === chars.nilChar){
        return undefined;
    } 
    this.dataToDecode = objStr;
    return this._d(this.schema);
}

function decoder(schema){
    this.schema = schema;
    this.index= 0;
}
module.exports= decoder;
},{"./chars":1,"./schema":7,"./util":9}],3:[function(require,module,exports){
var chars = require("./chars").chars;
var getKey = require("./util").getKey;
var dataType = require("./schema").dataType;
var charsArr = require("./chars").charsArr;

var encode = function(jObj,e_schema){
    if(e_schema.type.value > 4){
        //case dataType.ARRAY.value:
        //case dataType.OBJECT.value:

            var hasValidData = hasData(jObj);
            if(hasValidData === true){
                var str = "";
                if(e_schema.type.value === 6){
                    str += chars.arrStart;
                    var itemSchema = getKey(e_schema.properties,0);
                    //var itemSchemaType = itemSchema.type;
                    var arr_len = jObj.length;
                    for(var arr_i=0;arr_i < arr_len;){
                        var r;
                        /* if(itemSchema.type.value < 5 ){//comment to avoid recursion
                            r =  getValue(jObj[arr_i],itemSchema.type);
                        }else{ */
                            r =  encode(jObj[arr_i],itemSchema) ;
                        //}
                        str = processValue(str,r);
                        if(arr_len > ++arr_i){
                            str += chars.arraySepChar;
                        }
                    }
                }else{//object
                    str += chars.objStart;
                    var keys = Object.keys(e_schema.properties);
                    for(var i in keys){
                        var r;
                        /* if(e_schema.properties[keys[i]].type.value < 5 ){//comment to avoid recursion
                            r =  getValue(jObj[keys[i]],e_schema.properties[keys[i]].type);
                        }else { */
                            r =  encode(jObj[keys[i]],e_schema.properties[keys[i]]) ;
                        //}
                        str = processValue(str,r);
                    }
                }
                return str;
            }else{
                return hasValidData;
            }
    }else{//premitive
        return getValue(jObj,e_schema.type);
    }
}

function processValue(str,r){
    if(!isAppChar(r[0]) && !isAppChar(str[str.length -1])){
        str += chars.boundryChar;
    }
    return str + r;
}

var getValue= function(a,type){
    if(a === undefined) return chars.missingPremitive;
    else if(a === null) return chars.nilPremitive;
    else if( a === "") return chars.emptyValue;
    else return type.parse(a);
}

var checkForNilOrUndefined= function(a,type){
    if(a === undefined) return chars.missingPremitive;
    else if(a === null) return chars.nilPremitive;
    else if( a === "") return chars.emptyValue;
    else return type.parse(a);
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
    return nonDataArr.indexOf(ch) !== -1 || ( typeof ch === "object" && ch.length === 0 );
}

function isAppChar(ch){
    return charsArr.indexOf(ch) !== -1;
}

exports.encode= encode;
},{"./chars":1,"./schema":7,"./util":9}],4:[function(require,module,exports){
var boolean = require("./parsers/boolean");
var numParser = require("./parsers/number");
var dataType = require("./schema").dataType;
var updateSchema = require("./schema_updater").updateSchema;
var decoder = require("./decoder");
var encode = require("./encoder").encode;

function nimn(schema) {
    this.configDataType("boolean",boolean.parse,boolean.parseBack);
    this.configDataType("string",returnBack,returnBack);
    this.configDataType("number",numParser.parse,numParser.parseBack);
    this.configDataType("date",returnBack,returnBack);
    this.configDataType("object",returnBack,returnBack);
    this.configDataType("array",returnBack,returnBack);

    this.e_schema = Object.assign({},schema);
    updateSchema(this.e_schema);
}

function returnBack(a){ return a}
//function returnCallBack(a,callBack){ callBack(a)}

nimn.prototype.getDecoder= function(){
    return new decoder(this.e_schema);
}
/**
 * To register encoder and decoder for specific data type. 
 * 
 * Encoder function accepts value as parameter
 * 
 * Decoder function accepts value as a first parameter and callBack function as second optional parameter
 * @param {string} type 
 * @param {function} parseWith 
 * @param {function} parseBackWith 
 */
nimn.prototype.configDataType = function(type,parseWith,parseBackWith){
    var dType = dataType.getType(type);
    dType.parse = parseWith;
    dType.parseBack = parseBackWith;
}

nimn.prototype.encode = function(jObj){
        return encode(jObj,this.e_schema)
}

module.exports = nimn;
},{"./decoder":2,"./encoder":3,"./parsers/boolean":5,"./parsers/number":6,"./schema":7,"./schema_updater":8}],5:[function(require,module,exports){
var chars = require("../chars").chars;

function parse(val){
    return val ? chars.yesChar : chars.noChar;
}

function parseBack(val){
    return val === chars.yesChar ? true : false;
}


exports.parse = parse;
exports.parseBack = parseBack;

},{"../chars":1}],6:[function(require,module,exports){
var chars = require("../chars").chars;

function parse(val){
    return val;
}

function parseBack(val){
    if(val.indexOf(".") !== -1){
        val = Number.parseFloat(val);
    }else{
        val = Number.parseInt(val,10);
    }
    return val;
}


exports.parse = parse;
exports.parseBack = parseBack;

},{"../chars":1}],7:[function(require,module,exports){
var dataType = {
    STRING : { value: 1},
    NUMBER : { value: 2},
    DATE : { value: 3},
    BOOLEAN : { value: 4},
    OBJECT : { value: 5},
    ARRAY : { value: 6},
    getType(str){
        switch(str){
            case "string": return dataType.STRING;
            case "number": return dataType.NUMBER;
            case "date": return dataType.DATE;
            case "boolean": return dataType.BOOLEAN;
            case "object": return dataType.OBJECT;
            case "array": return dataType.ARRAY;
        }
    }
}

exports.dataType = dataType;
},{}],8:[function(require,module,exports){
var chars = require("./chars").chars;
var charsArr = require("./chars").charsArr;
var dataType = require("./schema").dataType;

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
            var Ks = Object.keys(schemaOfCurrentKey.properties);
            if(isArray(schemaOfCurrentKey) && Ks.length > 1) {
                throw Error("Schema Error: Multiple objects are not allowed inside array");
            }
            schemaOfCurrentKey.name = Ks[0];
            if(schemaOfLastKey && isArrayOrObject(schemaOfLastKey) && lastFieldSchemaToSet){
                lastFieldSchemaToSet = updateDataType(schemaOfCurrentKey,lastFieldSchemaToSet);
            }else{
                lastFieldSchemaToSet = updateDataType(schemaOfCurrentKey,schemaOfLastKey);
            }
            if(schemaOfNextKey === undefined){
                return lastFieldSchemaToSet;
            }else{
                setReadUntil(lastFieldSchemaToSet,schemaOfNextKey,isArray(schemaOfCurrentKey));
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
    return isArray(schema) || isObject(schema);
}

function isArray(schema){
    return schema.type === "array"  || schema.type === dataType.ARRAY;
}

function isObject(schema){
    return schema.type === "object"  || schema.type === dataType.OBJECT;
}


function setReadUntil(current,next,isArrayFlag){
    if(current.type === "boolean" || current.type === dataType.BOOLEAN){
        //do nothing
    }else{
        if(next.type === "boolean" || next.type === dataType.BOOLEAN){
            (current.readUntil = current.readUntil || []).push(chars.yesChar, chars.noChar, chars.nilPremitive, chars.missingPremitive);
        }else if(isObject(next)){
            (current.readUntil = current.readUntil || []).push(chars.nilChar, chars.missingChar, chars.emptyChar, chars.objStart);
        }else if(isArray(next)){
            (current.readUntil = current.readUntil || []).push(chars.nilChar, chars.missingChar, chars.emptyChar, chars.arrStart);
        }else{
            (current.readUntil = current.readUntil || []).push(chars.boundryChar, chars.nilPremitive, chars.missingPremitive, chars.arraySepChar);
        }
        if(isArrayFlag) current.readUntil.push (chars.arraySepChar);
    }
}

function updateSchema(schema){
    var lastFieldSchemaToSet = updateDataType(schema);
    setReadUntil(lastFieldSchemaToSet,{});
}
exports.updateSchema = updateSchema;
},{"./chars":1,"./schema":7}],9:[function(require,module,exports){
/**
 *  converts a ASCII number into equivalant ASCII char
 * @param {number} a 
 * @returns ASCII char
 */
var char = function (a){
    return String.fromCharCode(a);
}

/**
 * return key of an object
 * @param {*} obj 
 * @param {number} i 
 */
function getKey(obj,i){
    return obj[Object.keys(obj)[i]];
}

exports.char = char;
exports.getKey = getKey;
},{}]},{},[4])(4)
});