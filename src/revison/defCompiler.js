var fs = require('fs');
var path = require('path');
var DefBuilder = require('./DefBuilder');
var EnumEncoder = require('./EnumEncoder');

function compile(filepath){
    var dataContent = fs.readFileSync(filepath).toString();

    dataContent = dataContent.replace(/\/\/.*/g,"");//remove comments
    dataContent = dataContent.replace(/[ \t]+/g," ");//replace multiple spaces with single space

    //select all classes and enums
    const matches = getAllMatches(dataContent, new RegExp("([a-zA-Z_].*?{[^]*?})", "gm") );
    const defBuilder = new DefBuilder();

    for(let index in matches){//for each element
        const element = matches[index][0];
        if( isEnum( element ) ){//build enum type
            let enumName =  new RegExp("(.*){").exec( element )[1].trim();
            if( defBuilder.container[ enumName ] ){
                throw Error("Duplicate definitions confuse us. Please check your Nimn definition.");
            }
            const enumMatches = getAllMatches(element, new RegExp("(\\s*([0-9]{1,3}|[A-Za-z])\\s*:\\s*(.+))", "gm") );
            var _keys = [];
            for(let index in enumMatches){
                let name = enumMatches[index][3].trim();
                let val = enumMatches[index][2].trim();
                if( val < 127 || (typeof val === 'string' && val.length == 1 ) ){//number
                    _keys.push( val );
                }else{
                    throw Error("Invalid value for Enum in definition.");
                }
            }
            defBuilder.typeHandlers[ enumName.toLowerCase() ] = function(id) {
                const enumEncoder = new EnumEncoder(id);
                enumEncoder._keys = _keys;
                return enumEncoder;
            }
        }else{//build class type
            let className =  new RegExp("(.*){").exec( element )[1].trim();
            if( defBuilder.container[ className ] ){
                throw Error("Duplicate definitions confuse us. Please check your Nimn definition.");
            }
            const fieldMatches = getAllMatches(element, new RegExp("(\\d+)\\.\\s+(([^ <]+)(<(.*?)(,(.*?))?>)?) (.*)", "gm") );
            
            for(let index in fieldMatches){
                defBuilder.add(className, {
                    id : fieldMatches[index][1].trim(),
                    type : fieldMatches[index][3].trim().toLowerCase(),
                    keyType : fieldMatches[index][5] ? fieldMatches[index][5].trim().toLowerCase() : undefined, // present in case of list and map only
                    valueType : fieldMatches[index][7] ? fieldMatches[index][7].trim().toLowerCase() : undefined, // present in case of list and map only
                    name : fieldMatches[index][8].trim(),
                })
            }
            defBuilder.finish(className);
        }
        defBuilder.finish();
    }

    //process pending instructions to build a class
}

const getAllMatches = function(string, regex) {
    const matches = [];
    let match = regex.exec(string);
    while (match) {
        const allmatches = [];
        const len = match.length;
        for (let index = 0; index < len; index++) {
            allmatches.push(match[index]);
        }
        matches.push(allmatches);
        match = regex.exec(string);
    }
    return matches;
};

function isEnum(data){
    return doesMatch(data, new RegExp("[a-zA-Z_].*?{(\\s*([0-9]{1,3}|[A-Za-z])\\s*:\\s*[^ \\t]+)+}") );
}

const doesMatch = function(string, regex) {
    const match = regex.exec(string);
    return !(match === null || typeof match === "undefined");
};

compile( path.join( __dirname, "sample.nimn") );