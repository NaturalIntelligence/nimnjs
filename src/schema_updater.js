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
            (current.readUntil = current.readUntil || []).push(chars.yesChar, chars.noChar, chars.nilPremitive);
        }else if(isObject(next)){
            (current.readUntil = current.readUntil || []).push(chars.nilChar, chars.emptyChar, chars.objStart);
        }else if(isArray(next)){
            (current.readUntil = current.readUntil || []).push(chars.nilChar, chars.emptyChar, chars.arrStart);
        }else{
            (current.readUntil = current.readUntil || []).push(chars.boundryChar, chars.nilPremitive, chars.arraySepChar);
        }
        if(isArrayFlag) current.readUntil.push (chars.arraySepChar);
    }
}

function updateSchema(schema){
    var lastFieldSchemaToSet = updateDataType(schema);
    setReadUntil(lastFieldSchemaToSet,{});
}
exports.updateSchema = updateSchema;