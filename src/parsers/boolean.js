var chars = require("../chars").chars;
var char = require("../util").char;

function parse(val){
    return val ? yes : no;
}

function parseBack(val){
    return val === yes ? true : false;
}

var yes = char(217);
var no = char(218);

booleanCharset = {};
booleanCharset[yes] = true;
booleanCharset[no] = false;

exports.parse = parse;
exports.parseBack = parseBack;
exports.charset = booleanCharset;
