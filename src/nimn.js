var boolean = require("./parsers/boolean");
var numParser = require("./parsers/number");
var dataType = require("./schema").dataType;
var updateSchema = require("./schema_updater").updateSchema;
var decode = require("./decoder").decode;
var encode = require("./encoder").encode;

function nimn(schema) {
    this.configDataType("boolean",boolean.parse,boolean.parseBack);
    this.configDataType("string",returnBack,returnCallBack);
    this.configDataType("number",numParser.parse,numParser.parseBack);
    this.configDataType("date",returnBack,returnCallBack);
    this.configDataType("object",returnBack,returnCallBack);
    this.configDataType("array",returnBack,returnCallBack);

    updateSchema(schema);
    this.e_schema = schema;
}

function returnBack(a){ return a}
function returnCallBack(a,callBack){ callBack(a)}

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

nimn.prototype.decode = function(objStr,options){
    this.decodingOptions = options;
    return decode(objStr,0,this.e_schema).val;
}

module.exports = nimn;