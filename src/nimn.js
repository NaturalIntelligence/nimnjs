
var char = require("./common").char;
var inRange = require("./common").inRange;
var startsWithNimnChar = require("./common").startsWithNimnChar;
var read = require("./common").read;
var sanitize = require("./common").sanitize;
var removeBackspace = require("./common").removeBackspace;

/* var decodeNimnChar = {};
decodeNimnChar[char(175)] = null;
decodeNimnChar[char(184)] = undefined;
decodeNimnChar[char(177)] = "";
decodeNimnChar[char(181)] = true;
decodeNimnChar[char(183)] = false; */

/* var booleanValues = {};
booleanValues[undefined] = chars.missingPremitive;
booleanValues[null] = chars.nilPremitive;
booleanValues[true] = chars.yes;
booleanValues[false] = chars.no;

var stringValues = {};
stringValues[undefined] = chars.missingPremitive;
stringValues[null] = chars.nilPremitive;
stringValues[""] = chars.emptyPremitive;

var numberValues = {};
numberValues[undefined] = chars.missingPremitive;
numberValues[null] = chars.nilPremitive; */

var BooleanType = require("./booleanType");
var StringType = require("./stringType");
var NumberType = require("./numberType");
var MapType = require("./mapType");
var ListType = require("./listType");
var VarMapType = require("./varMapType");

function buildSchema(schema, shouldSanitize){
    if(shouldSanitize !== false){
        shouldSanitize = true;
    }

    if(schema.type === "map"){
        var mapSchema = new MapType(schema.name);
        mapSchema._keys = [];
        mapSchema._len = schema.detail.length;
        for(var i=0; i < mapSchema._len; i++){
            mapSchema._keys.push( buildSchema(schema.detail[i], shouldSanitize ) );
        }
        return mapSchema;
    }else if(schema.type === "list"){
        var listSchema = new ListType(schema.name);
        listSchema._item = buildSchema(schema.detail, shouldSanitize);
        return listSchema;
    }else if(schema.type === "varmap"){
        var listSchema = new VarMapType(schema.name);
        listSchema._item = buildSchema(schema.detail, shouldSanitize);
        return listSchema;
    }else if(schema.type === "boolean"){
        return new BooleanType(schema.name, schema.default);
    }else  if(schema.type === "string"){
        return new StringType(schema.name, schema.default, shouldSanitize);
    }else{//number
        return new NumberType(schema.name, schema.default);
    }
}

function parse(schema, jsObj){
    return schema._encode(jsObj);
}

function parseBack(schema, nimnData){
    return schema._decode(nimnData,0).value;
}


exports.buildSchema = buildSchema;
exports.stringify = parse;
exports.parse = parseBack;