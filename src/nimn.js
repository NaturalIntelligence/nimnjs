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

    //this.e_schema = Object.assign({},schema);
    this.e_schema = JSON.parse(JSON.stringify(schema));
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