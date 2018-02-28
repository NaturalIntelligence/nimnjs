var boolean = require("./parsers/boolean");
var numParser = require("./parsers/number");
var dataType = require("./schema").dataType;
var chars = require("./chars").chars;
var appCharsArr = require("./chars").charsArr;
var schemaUpdater = require("./schema_updater");
var Decoder = require("./decoder");
var Encoder = require("./encoder");
var DataHandler = require("./DataHandler");

function nimn() {
    this.handledChars = appCharsArr.slice();
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
nimn.prototype.updateSchema= function(schema){
    this.schema = JSON.parse(JSON.stringify(schema));
    new schemaUpdater(this.dataHandlers).update(this.schema);
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
 * @param {boolean} [treatAsUnique=false]  - if true encoder will not separate given type's value with boundary char
 */
nimn.prototype.addDataHandler = function(type,parseWith,parseBackWith,charset,treatAsUnique){
    var dataHandler = new DataHandler(type,/* parseWith,parseBackWith, */charset,treatAsUnique);
    if(parseWith)  dataHandler.parse = parseWith;
    if(parseBackWith) dataHandler.parseBack = parseBackWith;

    //unque charset don't require boundary char. Hence checl them is they are already added
    if(treatAsUnique){
        var keys = Object.keys(charset);

        for(var k in keys){
            var ch = keys[k];
            if(this.handledChars.indexOf(ch) !== -1){
                throw Error("Charset Error: "+ ch +" is not allowed. Either it is reserved or being used by another data handler");
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
    var decoder = new Decoder(this.schema,this.dataHandlers,this.handledChars);
    return decoder.decode(encodedVal);
}
module.exports = nimn;