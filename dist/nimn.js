(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.nimn = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
/**
 * 
 * @param {string} dataType 
 * @param {function} parse 
 * @param {function} parseBack 
 * @param {object} charset
 * @param {boolean} treatAsUnique
 */
function DataHandler(dataType, /* parse, parseBack, */ charset,treatAsUnique){
    this.dataType = dataType;
    //parse || (this.parse = parse);
    //parseBack || (this.parseBack = parseBack);
    if(charset){
        //this.hasFixedInstances = true;
        this.char2val = charset;
        this.val2char = {};
        var keys = Object.keys(charset);
        for(var i in keys){
            var val = charset[keys[i]];
            this.val2char[val] = keys[i];
        }

        this.charcodes = Object.keys(charset);
    }
    if(treatAsUnique){
        this.hasFixedInstances = true;
    }

    //this.treatAsUnique = treatAsUnique;
}

DataHandler.prototype.parse = function(a){
    if(this.char2val){
        return this.getCharCodeFor(a);
    }else{
        return a;
    }
}

DataHandler.prototype.parseBack = function(a){
    if(this.char2val){
        return this.getValueOf(a);
    }else{
        return a;
    }
}

/**
 * returns an array of supported characters or empty array when it supportes dynamic data
 */
DataHandler.prototype.getCharCodes =function(){
    return this.charcodes;
}

DataHandler.prototype.getValueOf =function(chCode){
    return this.char2val[chCode];
}

DataHandler.prototype.getCharCodeFor =function(value){
    return this.val2char[value];
}

module.exports = DataHandler;
},{}],2:[function(require,module,exports){
var char = require("./util").char;


/* 176-178
180-190
198-208
219-223
 */

const chars= {
    nilChar : char(176),
    missingChar : char(201),
    nilPremitive : char(175),
    missingPremitive : char(200),

    emptyChar : char(178),
    emptyValue:  char(177),//empty Premitive
    
    boundryChar : char(179),
    
    objStart: char(198),
    arrStart: char(204),
    arrayEnd: char(185),
}

const charsArr = [
    chars.nilChar ,
    chars.nilPremitive,
    chars.missingChar,
    chars.missingPremitive,
    chars.boundryChar ,
    chars.emptyChar,
    chars.emptyValue,
    chars.arrayEnd,
    chars.objStart,
    chars.arrStart
]

exports.chars = chars; 
exports.charsArr = charsArr; 
},{"./util":10}],3:[function(require,module,exports){
var chars = require("./chars").chars;

decoder.prototype._d = function(schema){
    if(ifNil(this.currentChar())){
        this.index++;
        return null;
    }else if(ifMissing(this.currentChar())){
        this.index++;
        return undefined;
    }else if(typeof schema.type === "string"){//premitive
        return this.readPremitiveValue(schema);
    }else if(Array.isArray(schema)){
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
            }while(this.dataToDecode[this.index] !== chars.arrayEnd);
            ++this.index;
            return obj;
        }
    }else{//object
        if(this.currentChar() === chars.emptyChar){
            this.index++;
            return {};
        }else if(this.currentChar() !== chars.objStart){
            throw Error("Parsing error: Object start char was expected : " + this.currentChar());
        }else{
            this.index++;//skip object start char
            var keys = Object.keys(schema);
            var len = keys.length;
            var obj = {};
            for(var i=0; i< len; i++){
                
                var r =  this._d(schema[keys[i]]) ;
                if(r !== undefined){
                    obj[keys[i]] = r;
                }
            }
            return obj;
        }
    }
}

function ifNil(ch){
    return ch === chars.nilChar || ch === chars.nilPremitive;
}

function ifMissing(ch){
    return ch === chars.missingChar || ch === chars.missingPremitive;
}
/**
 * returns character index pointing to
 */
decoder.prototype.currentChar = function(){
    return this.dataToDecode[this.index];
}

decoder.prototype.readPremitiveValue = function(schemaOfCurrentKey){
    var val = this.readFieldValue(schemaOfCurrentKey);
    if(this.currentChar() === chars.boundryChar) this.index++;
    var dh = this.dataHandlers[schemaOfCurrentKey.type];
    return dh.parseBack(val);
}

/**
 * Read characters until app supported char is found
 */
decoder.prototype.readFieldValue = function(schemaOfCurrentKey){
    if(schemaOfCurrentKey.readUntil){
        if(this.currentChar() === chars.emptyValue){
            this.index++;
            return "";
        }else{
            var until = schemaOfCurrentKey.readUntil;
            var len = this.dataToDecode.length;
            var start = this.index;
            
            for(;this.index < len && until.indexOf(this.currentChar()) === -1;this.index++);
            return this.dataToDecode.substr(start, this.index-start);
        }
    }else{
        return this.dataToDecode[this.index++];
    }    
}


decoder.prototype.decode = function(objStr){
    this.index= 0;
    if(!objStr || typeof objStr !== "string" || objStr.length === 0) throw Error("input should be a valid string");
    this.dataToDecode = objStr;
    return this._d(this.schema);
}

function decoder(schema,dataHandlers){
    this.schema = schema;
    this.dataHandlers = dataHandlers;
}
module.exports = decoder;
},{"./chars":2}],4:[function(require,module,exports){
var chars = require("./chars").chars;
var appCharsArr = require("./chars").charsArr;

Encoder.prototype._e = function(jObj,e_schema){
    if(typeof e_schema.type === "string"){//premitive
        return this.getValue(jObj,e_schema.type);
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
                }
                str += chars.arrayEnd;//indicates that next item is not array item
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
    switch(a){
        case undefined: return chars.missingPremitive;
        case null: return chars.nilPremitive;
        case "": return chars.emptyValue;
        default: return this.dataHandlers[type].parse(a);
    }
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
    this.handledChars = appCharsArr.slice();
    this.handledChars = this.handledChars.concat(charArr);

    this.schema = schema;
}

module.exports = Encoder;
},{"./chars":2}],5:[function(require,module,exports){

/**
 * Verify if all the datahandlers are added given in schema.
 * @param {*} schema 
 * @param {*} datahandlers 
 */
var validateSchema = function(schema,datahandlers){
    if(Array.isArray(schema)){
        validateSchema(schema[0],datahandlers);
    }else if(typeof schema === "object"){
        var keys = Object.keys(schema);
        var len = keys.length;

        for(var i=0; i< len; i++){
            var key = keys[i];
            var nextKey = keys[i+1];

            validateSchema(schema[key],datahandlers);
        }
    }else{
        if(!datahandlers[schema]){
            throw Error("You've forgot to add data handler for " + schema)
        }
    }
}

exports.validateSchema = validateSchema;
},{}],6:[function(require,module,exports){
var boolean = require("./parsers/boolean");
var numParser = require("./parsers/number");
var chars = require("./chars").chars;
var appCharsArr = require("./chars").charsArr;
var helper = require("./helper");
var schemaMarker = require("./schemaMarker");
var Decoder = require("./decoder");
var Encoder = require("./encoder");
var DataHandler = require("./DataHandler");

function nimn() {
    this.handledChars = [];//appCharsArr.slice();
    this.dataHandlers = {};
    this.addDataHandler("boolean",null,null,boolean.charset,true);
    //this.addDataHandler("boolean",boolean.parse,boolean.parseBack,boolean.charset,true);
    this.addDataHandler("string");
    this.addDataHandler("number",numParser.parse, numParser.parseBack);
    this.addDataHandler("date");
}

/**
 * This method should be called once all the data handlers are registered. 
 * It updates internal schema based on given schema.
 * 
 * @example
 * {
 *      "field1" : "string",
 *      "field2" : "date",
 *      "field3" : {
 *          "field4" : "number"
 *      },
 *      "field5" : [ "image"],
 *      "field6" : [{ "field7" : "boolean"}]
 * }
 * @param {*} schema 
 * @returns {void}
 */
nimn.prototype.addSchema= function(schema){
    this.schema = JSON.parse(JSON.stringify(schema));
    new schemaMarker(this.dataHandlers).markNextPossibleChars(this.schema);
    //helper.validateSchema(schema,this.dataHandlers);
    this.encoder = new Encoder(this.schema,this.dataHandlers,this.handledChars);
}

/**
 * You can update existnig handler od add new using this method.
 * "string", "number", "boolean", and "date" are handled by default.
 * 
 * charset should be set when given type should be treated as enum or fixed set of values
 * @example
 * //to map
 * nimnInstance.addDataHandler("status",null,null,{ "R": "running", "S" : "stop", "I", "ready to run"},false)
 * @example
 * //just for identification
 * nimnInstance.addDataHandler("image");
 * @example
 * //to compress more
 * nimnInstance.addDataHandler("date", datecompressor.parse, datecompressor.parseBack);
 * @param {string} type 
 * @param {function} parseWith - will be used by encoder to encode given type's value
 * @param {function} parseBackWith - will be used by decoder to decode given type's value
 * @param {Object} charset - map of charset and fixed values
 * @param {boolean} [noBoundaryChar=false]  - if true encoder will not separate given type's value with boundary char
 */
nimn.prototype.addDataHandler = function(type,parseWith,parseBackWith,charset,noBoundaryChar){
    var dataHandler = new DataHandler(type,/* parseWith,parseBackWith, */charset,noBoundaryChar);
    if(parseWith)  dataHandler.parse = parseWith;
    if(parseBackWith) dataHandler.parseBack = parseBackWith;

    //unque charset don't require boundary char. Hence check them is they are already added
    if(noBoundaryChar && charset){
        var keys = Object.keys(charset);

        for(var k in keys){
            var ch = keys[k];
            if(this.handledChars.indexOf(ch) !== -1 || appCharsArr.indexOf(ch) !== -1){
                throw Error("DataHandler Error: "+ ch +" is not allowed. Either it is reserved or being used by another data handler");
            }else{
                this.handledChars.push(ch);
            }
        }
    }

    this.dataHandlers[type] = dataHandler;
}

nimn.prototype.encode = function(jObj){
        return this.encoder.encode(jObj);
}

nimn.prototype.decode= function(encodedVal){
    var decoder = new Decoder(this.schema,this.dataHandlers);
    return decoder.decode(encodedVal);
}
module.exports = nimn;
},{"./DataHandler":1,"./chars":2,"./decoder":3,"./encoder":4,"./helper":5,"./parsers/boolean":7,"./parsers/number":8,"./schemaMarker":9}],7:[function(require,module,exports){
var chars = require("../chars").chars;
var char = require("../util").char;

var yes = char(181);
var no = char(183);

booleanCharset = {};
booleanCharset[yes] = true;
booleanCharset[no] = false;

exports.charset = booleanCharset;

},{"../chars":2,"../util":10}],8:[function(require,module,exports){
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

},{"../chars":2}],9:[function(require,module,exports){
var chars = require("./chars").chars;
var appCharsArr = require("./chars").charsArr;

schemaMarker.prototype._m = function(schema){
    if(Array.isArray(schema)){
        if(typeof schema[0] === "string"){
            var itemSchema = {
                type : schema[0]
            }
            this.setReadUntil(itemSchema, schema[0]);
            schema[0] = itemSchema;//make it object so a function cant set it's value
            if(schema[0].readUntil)
                schema[0].readUntil.push(chars.arrayEnd);
        }else{
            this._m(schema[0]);//let's object portion handle it
            var lastMostKey = getLastMostKey(schema[0]);
            if(lastMostKey){
                this.setReadUntil(lastMostKey, schema[0]);
                if(lastMostKey.readUntil)
                    lastMostKey.readUntil.push(chars.arrayEnd);
            }else{
                //lastmostkey was set as it was under an array
            }
        }
    }else if(typeof schema === "object"){
        var keys = Object.keys(schema);
        var len = keys.length;

        for(var i=0; i< len; i++){
            var key = keys[i];
            var nextKey = keys[i+1];
            
            this._m(schema[key]);
            if(Array.isArray(schema[key])) continue;
            else if(nextKey){
                if(typeof schema[key] !== "string"){//not an object
                    var lastMostKey = getLastMostKey(schema[key]);
                    if(lastMostKey){
                        this.setReadUntil(lastMostKey,schema[nextKey]);
                    }else{
                        //lastmostkey was set as it was under an array
                    }
                }else{
                    var itemSchema = {
                        type : schema[key]
                    }
                    this.setReadUntil(itemSchema,schema[nextKey]);
                    schema[key] = itemSchema ;
                }
            }else{
                if(typeof schema[key] === "object") continue;
                schema[key] = {
                    type : schema[key]
                }
            }
        }
    }else{
        if(!this.dataHandlers[schema]){//handled
            throw Error("You've forgot to add data handler for " + schema)
        }
    }
}


schemaMarker.prototype.setReadUntil = function(current,next){
    //status: R,S
    if(this.dataHandlers[current.type].hasFixedInstances){
        //if current char is set by user and need to be separated by boundary char
        //then don't set readUntil, read current char
        return ;
    }else{
        
        //return [chars.boundryChar, chars.missingPremitive, chars.nilPremitive];
        if(Array.isArray(next)){
            current.readUntil =  [ chars.arrStart, chars.missingChar, chars.emptyChar, chars.nilChar];
        }else if(typeof next === "object"){
            current.readUntil =  [ chars.objStart, chars.missingChar, chars.emptyChar, chars.nilChar];
        }else{
            if(this.dataHandlers[next] && this.dataHandlers[next].hasFixedInstances){//but need to be separated by boundary char
                //status,boolean
                current.readUntil = [chars.missingPremitive, chars.nilPremitive];
                current.readUntil = current.readUntil.concat(this.dataHandlers[next].getCharCodes());
            }else{
                ///status,age
                current.readUntil =   [chars.boundryChar, chars.emptyValue, chars.missingPremitive, chars.nilPremitive];
            }
        }
    }
}

/**
 * obj can't be an array
 * @param {*} obj 
 */
function getLastMostKey(obj){
    var lastProperty;
    if(Array.isArray(obj)){
        return;
    }else{
        var keys = Object.keys(obj);
        lastProperty = obj[keys[keys.length-1]];
    }
    
    if(typeof lastProperty === "object" && !(lastProperty.type && typeof lastProperty.type === "string")){
        return getLastMostKey(lastProperty);
    }else{
        return lastProperty;
    }
}


schemaMarker.prototype.markNextPossibleChars = function(schema){
    this._m(schema);
    if(!Array.isArray(schema)){
        var lastMostKey = getLastMostKey(schema);
        if(lastMostKey){
            lastMostKey.readUntil = [chars.nilChar]
        }
    }
}
function schemaMarker(dataHandlers){
    this.dataHandlers = dataHandlers;
}

module.exports = schemaMarker;
},{"./chars":2}],10:[function(require,module,exports){
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
/* function getKey(obj,i){
    return obj[Object.keys(obj)[i]];
}
 */

/* function indexOf(arr,searchedID) {
    var arrayLen = arr.length;
    var c = 0;
    while (c < arrayLen) {
        if (arr[c] === searchedID) return c;
        c++;
    }
    return -1;
} */
exports.char = char;
//exports.indexOf = indexOf;
},{}]},{},[6])(6)
});