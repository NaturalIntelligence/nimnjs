var chars = require("../chars").chars;
var char = require("../util").char;

var yes = char(217);
var no = char(218);

booleanCharset = {};
booleanCharset[yes] = true;
booleanCharset[no] = false;

exports.charset = booleanCharset;
