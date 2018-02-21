var char = require("./util").char;


/* 176-178
180-190
198-208
219-223
 */

module.exports = {
    nilChar : char(0),
    missingChar : char(0),
    nilPremitive : char(176),
    missingPremitive : char(176),
    emptyChar : char(177),
    yesChar : char(217),
    noChar : char(218),
    boundryChar : char(186),
    //fieldSepChar : char(221),
    arraySepChar: char(197)
}

//SPEC
/*
1. null and undefined will be treated as same
2. an array or object can be empty not a premetive field
3. nilChar for an array or object will be different than char for premetive field
4. boundry char will be used to identify the boundries
5. arraySepChar say if next sequence is array item

*/