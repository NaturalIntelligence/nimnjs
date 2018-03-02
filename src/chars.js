var char = require("./util").char;


/* 176-178
180-190
198-208
219-223
 */

const chars= {
    nilChar : char(254),
    missingChar : char(200),
    nilPremitive : char(176),
    missingPremitive : char(201),
    emptyChar : char(177),
    emptyValue:  char(178),
    boundryChar : char(186),
    arrayEnd: char(197),
    objStart: char(198),
    arrStart: char(199)
}

const charsArr = [
    chars.nilChar ,
    chars.nilPremitive,
    chars.missingChar,
    chars.missingPremitive,
    chars.boundryChar ,
    chars.emptyChar,
    chars.arrayEnd,
    chars.objStart,
    chars.arrStart
]

exports.chars = chars; 
exports.charsArr = charsArr; 