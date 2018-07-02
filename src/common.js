exports.DataType = {
        BOOLEAN : 1,
        LIST : 2,
        MAP : 3,
        VARMAP : 4,
        STRING : 5,
        NUMBER : 6,
    }

var char = function (a){
    return String.fromCharCode(a);
}
exports.char = char;

exports.range = {
        start : char(175),
        end : char(188),
    }
exports.chars= {
        nilChar : char(176),
        nilPremitive : char(175),
    
        missingChar : char(186),
        missingPremitive : char(184),
    
        emptyChar : char(178),
        emptyPremitive:  char(177),//empty Premitive
        
        boundaryChar : char(179),
        fieldNameBoundaryChar : char(188),
        
        objStart: char(182),
        objEnd: char(180),
        arrStart: char(187),
        arrEnd: char(185),
    
        yes: char(181),
        no: char(183),
    }



exports.startsWithNimnChar = function(str, type){
    return type._type < 5 || ( str.length === 1 && inRange(str) );
}

//var nimnCharRegx = new RegExp("([\xAF\xB0\xB1\xB2\xB3\xB4\xB5\xB6\xB7\xB8\xB9\xBA\xBB])", 'g');
//var nimnCharRegx = new RegExp("[^\]([\xAF-\xBB])", 'g');
/* function sanitize(v){
    return v.replace(nimnCharRegx,'\\$1');
    //return v;
} */

var inRange = function (v){
    return v >= exports.range.start && v <= exports.range.end;
}

exports.inRange = inRange;

exports.read = function(str,from,to){
    to = to || str.length;
    for(;from < to;from++){
        if( inRange(str[ from ]) && str[ from -1 ] !== "\\"){
            return from;
        }
    }
    return to;
}

exports.sanitize = function(str){
    var newStr = "";
    for(var i=0;i < str.length;i++){
        if( inRange( str[ i]  ) ){
            newStr += `\\${str[ i]}`
        }else{
            newStr += str[ i];
        }
    }
    return newStr;
}

exports.removeBackspace = function(str){
    var newStr = "";
    for(var i=0;i < str.length;i++){
        if( str[ i ] === "\\" && inRange( str[ i +1 ]  )){
            continue;
        }
        newStr += str[ i ];
    }
    return newStr;
}