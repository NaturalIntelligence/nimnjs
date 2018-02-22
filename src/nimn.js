var getKey = require("./util").getKey;
var chars = require("./chars").chars;
var charsArr = require("./chars").charsArr;
var valParser = require("./val_parser");
var dataType = require("./schema").dataType;
var updateSchema = require("./schema_updater").updateSchema;
var decode = require("./decoder").decode;
var encode = require("./encoder").encode;

function nimn(schema) {
    updateSchema(schema);
    this.e_schema = schema;
}

nimn.prototype.encode = function(jObj){
        return encode(jObj,this.e_schema)
}

nimn.prototype.decode = function(objStr,options){
    this.decodingOptions = options;
    return decode(objStr,0,this.e_schema).val;
}

module.exports = nimn;