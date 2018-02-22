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
function getKey(obj,i){
    return obj[Object.keys(obj)[i]];
}

exports.char = char;
exports.getKey = getKey;