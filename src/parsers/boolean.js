var chars = require("../chars").chars;

function parse(val){
    return val ? chars.yesChar : chars.noChar;
}

function parseBack(val,callback){
    callback(val === chars.yesChar ? true : false);
}


exports.parse = parse;
exports.parseBack = parseBack;
