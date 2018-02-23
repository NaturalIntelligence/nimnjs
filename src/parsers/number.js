var chars = require("../chars").chars;

function parse(val){
    return val;
}

function parseBack(val,callback){
    if(val.indexOf(".") !== -1){
        val = Number.parseFloat(val);
    }else{
        val = Number.parseInt(val,10);
    }
    callback(val);
}


exports.parse = parse;
exports.parseBack = parseBack;
