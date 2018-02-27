var chars = require("./chars").chars;
var charsArr = require("./chars").charsArr;
var dataType = require("./schema").dataType;

/**
 * Update schema type with equivalent dataType key for for fast processing. 
 * Update each field in schema to be aware with next field for fast and easy decoding.
 * @param {*} schema 
 * @param {*} lastfieldSchema 
 */
function updateDataType(schema){
    if(isArray(schema)){
        var lastFieldSchemaToSet = updateDataType(schema[0]);
        if(typeof lastFieldSchemaToSet === "string"){
            lastFieldSchemaToSet = {};
        }
        if(typeof schema[0] === "string"){
            schema[0] = lastFieldSchemaToSet;
        }
        lastFieldSchemaToSet.readUntil = lastFieldSchemaToSet.readUntil || [];
        pushIfNotExist(lastFieldSchemaToSet.readUntil,chars.arraySepChar);
        return lastFieldSchemaToSet;
    }else if(isObject(schema)){
        var keys = Object.keys(schema);
        var len = keys.length;
        var lastFieldSchemaToSet;
        for(var i=0; i< len; i++){
            var key = keys[i];
            var nextKey = keys[i+1];

            lastFieldSchemaToSet = updateDataType(schema[key]);
            if(typeof schema[key] !== "object"){
                schema[key] = lastFieldSchemaToSet;
            }
            if(len > i+1){
                setReadUntil(lastFieldSchemaToSet,schema[nextKey]);
            }

        }
        return lastFieldSchemaToSet;//return last key to somone upstair can set it.

    }else{
        return dataType.getInstance(schema);
    }
}

function isArrayOrObject(schema){
    return isArray(schema) || isObject(schema);
}

function isArray(schema){
    return Array.isArray(schema);
}

function isObject(schema){
    return typeof schema === "object";
}


function setReadUntil(current,next){
   /*  if(current === "boolean" || current.value === dataType.BOOLEAN.value){
        //do nothing
    }else{ */
        current.readUntil = current.readUntil || [];
        if(next === "boolean" || next.value === dataType.BOOLEAN.value){
            pushIfNotExist(current.readUntil,chars.yesChar, chars.noChar, chars.nilPremitive, chars.missingPremitive);
        }else if(isArray(next)){
            pushIfNotExist(current.readUntil,chars.nilChar, chars.missingChar, chars.emptyChar, chars.arrStart);
        }else if(isObject(next)){
            pushIfNotExist(current.readUntil,chars.nilChar, chars.missingChar, chars.emptyChar, chars.objStart);
        }else{
            pushIfNotExist(current.readUntil,chars.boundryChar, chars.nilPremitive, chars.missingPremitive, chars.arraySepChar);
        }
    //}
}

function pushIfNotExist(){
    for(var arg_i = 1; arg_i < arguments.length; arg_i++){
        if(arguments[0].indexOf(arguments[arg_i]) !== -1 ) continue;
        else arguments[0].push(arguments[arg_i]);
    }
}

function updateSchema(schema){
    var lastFieldToSet = updateDataType(schema);
    if(!lastFieldToSet.readUntil){
        lastFieldToSet.readUntil = [chars.nilChar];
    }
    //setReadUntil(lastFieldSchemaToSet,{});
}
exports.updateSchema = updateSchema;