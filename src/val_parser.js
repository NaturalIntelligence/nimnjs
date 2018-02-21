var chars = require("./chars").chars;

function parseNumber(val){
    return val;

}


function parseBoolean(val){
    return val ? chars.yesChar : chars.noChar;
}

exports.parseBoolean = parseBoolean;
exports.parseNumber = parseNumber;