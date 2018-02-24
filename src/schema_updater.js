var chars = require("./chars").chars;
var charsArr = require("./chars").charsArr;
var dataType = require("./schema").dataType;

/**
 * Update schema type with equivalent dataType key for fast processing. 
 * @param {*} schema 
 * @param {*} lastfieldSchema 
 */
function updateSchema(schema){
    schema.type = dataType.getType(schema.type);
    var properties = schema.properties;
    var keys = Object.keys(properties);
    var len = keys.length;
    for(var i=0; i< len; i++){
        var key = keys[i];
        var nextKey = keys[i+1];
        var schemaOfCurrentKey = properties[key];
        if(isArrayOrObject(schemaOfCurrentKey)){
            updateSchema(schemaOfCurrentKey);
        }else{
            schemaOfCurrentKey.type = dataType.getType(schemaOfCurrentKey.type);
        }
    }
}

function isArrayOrObject(schema){
    return schema.type === "array" || schema.type === "object";
}

exports.updateSchema = updateSchema;