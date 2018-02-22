var chars = require("./chars").chars;
var dataType = require("./schema").dataType;

function parseNumber(val){
    return val;

}


function parseBoolean(val){
    return val ? chars.yesChar : chars.noChar;
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


exports.parseBoolean = parseBoolean;
exports.parseNumber = parseNumber;
exports.unparse = unparse;