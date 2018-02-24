var char = require("./util").char;


/* 176-178
180-190
198-208
219-223
 */

const chars= {
    nilChar : char(0),
    missingChar : char(0),
    nilPremitive : char(176),
    missingPremitive : char(176),
    emptyChar : char(177),
    emptyValue:  char(178),
    yesChar : char(217),
    noChar : char(218),
    boundryChar : char(186),
    arraySepChar: char(197)
}

const charsArr = [
    chars.nilChar ,
    chars.nilPremitive,
    chars.boundryChar ,
    chars.emptyChar,
    chars.yesChar,
    chars.noChar,
    chars.arraySepChar,
]

exports.chars = chars; 
exports.charsArr = charsArr; 