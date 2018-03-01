var chars = require("./chars").chars;
var charsArr = require("./chars").charsArr;
var dataType = require("./schema").dataType;

/**
 * Update schema type with equivalent dataType key for for fast processing. 
 * Update each field in schema to be aware with next field for fast and easy decoding.
 * @param {*} schema 
 * @param {*} lastfieldSchema 
 */
schemaUpdater.prototype. _u = function(schema){
    if(isArray(schema)){
        var lastFieldSchemaToSet = this._u(schema[0]);
        
        if(typeof lastFieldSchemaToSet === "string"){
            lastFieldSchemaToSet = {};
        }
        //next char can either be end of array or character for start of array
        
        this.setReadUntil(lastFieldSchemaToSet,schema[0]);
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

            lastFieldSchemaToSet = this._u(schema[key]);
            if(typeof schema[key] !== "object"){
                schema[key] = lastFieldSchemaToSet;
            }
            if(len > i+1){
                this.setReadUntil(lastFieldSchemaToSet,schema[nextKey]);
            }

        }
        return lastFieldSchemaToSet;//return last key to somone upstair can set it.

    }else{
        return { value: schema};
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


/**
 * 
 * @param {*} current 
 * @param {*} next 
 */
schemaUpdater.prototype.setReadUntil = function(current,next){
    //Don't set "read until" if current char has fixed 
    
    current.readUntil = current.readUntil || [];
    if(isArray(next)){
        pushIfNotExist(current.readUntil,chars.nilChar, chars.missingChar, chars.emptyChar, chars.boundryChar, chars.arrStart);
    }else if(this.datahandlers[next] && this.datahandlers[next].hasFixedInstances){
        pushIfNotExist(current.readUntil, chars.nilPremitive, chars.missingPremitive, this.datahandlers[next].getCharCodes());
    }else if(isObject(next)){
        pushIfNotExist(current.readUntil,chars.nilChar, chars.missingChar, chars.emptyChar, chars.objStart);
    }else{
        if(!this.datahandlers[next]) throw Error("You've forgot to add data handler for " + next);
        pushIfNotExist(current.readUntil,chars.boundryChar, chars.nilPremitive, chars.missingPremitive, chars.arraySepChar);
    }
}

/**
 * First parameter is an array. Other are either premitives or array of premitives
 */
function pushIfNotExist(){
    var arr = arguments[0];
    for(var arg_i = 1; arg_i < arguments.length; arg_i++){
        var arg = arguments[arg_i];
        if(Array.isArray(arg)){
            for(var i=0; i < arg.length; i++){
                if(arr.indexOf(arg[i]) === -1 ) arr.push(arg[i]);    
            }
        }else{
            if(arr.indexOf(arg) === -1 ) arr.push(arg)
        }
    }
}

function schemaUpdater(datahandlers){
    this.datahandlers = datahandlers;
}

schemaUpdater.prototype.update= function(schema){
    var lastFieldToSet = this._u(schema);
    if(!lastFieldToSet.readUntil){
        lastFieldToSet.readUntil = [chars.nilChar];
    }
    //setReadUntil(lastFieldSchemaToSet,{});
}
module.exports = schemaUpdater;