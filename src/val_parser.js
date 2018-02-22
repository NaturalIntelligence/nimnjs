var chars = require("./chars").chars;
var dataType = require("./schema").dataType;

function parseNumber(val){
    return val;

}


function parseBooleanValue(val){
    return val ? chars.yesChar : chars.noChar;
}

function parseStringValue(val){
    return val;
}

function parseNumberValue(val){
    return val;
}

function parseDateValue(val){
    return val;
}


function unparseBooleanValue(val){
    return val === chars.yesChar ? true : false;
}
function unparseStringValue(val){
    return val;
}
function unparseNumberValue(val){
    return val;
}
function unparseDateValue(val){
    return val;
}
var unparse = {};
unparse[dataType.BOOLEAN] = unparseBooleanValue;
unparse[dataType.STRING] = unparseStringValue;
unparse[dataType.NUMBER] = unparseNumberValue;
unparse[dataType.DATE] = unparseDateValue;


var parse = {};
parse[dataType.BOOLEAN] = parseBooleanValue;
parse[dataType.STRING] = parseStringValue;
parse[dataType.NUMBER] = parseNumberValue;
parse[dataType.DATE] = parseDateValue;

exports.parse = parse;
exports.unparse = unparse;