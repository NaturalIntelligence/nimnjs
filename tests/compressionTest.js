var nimn = require("../src/nimn");
var chars = require("../src/chars");
var nimnSchemaBuilder = require("nimn_schema_builder");
var nimnDateparser = require("nimn-date-parser");
var zlib = require('zlib');

var data = {
    "any_name": {
        "person": [
            {
                "phone": [
                    122233344550,
                    122233344551
                ],
                "name": "Jack",
                "age": 33,
                "married": "Yes",
                "birthday": "Wed, 28 Mar 1979 12:13:14 +0300",
                "address": [
                    {
                        "city": "New York",
                        "street": "Park Ave",
                        "buildingNo": 1,
                        "flatNo": 1
                    },
                    {
                        "city": "Boston",
                        "street": "Centre St",
                        "buildingNo": 33,
                        "flatNo": 24
                    }
                ]
            },
            {
                "phone": [
                    122233344553,
                    122233344554
                ],
                "name": "Boris",
                "age": 34,
                "married": "Yes",
                "birthday": "Mon, 31 Aug 1970 02:03:04 +0300",
                "address": [
                    {
                        "city": "Moscow",
                        "street": "Kahovka",
                        "buildingNo": 1,
                        "flatNo": 2
                    },
                    {
                        "city": "Tula",
                        "street": "Lenina",
                        "buildingNo": 3,
                        "flatNo": 78
                    }
                ]
            }
        ]
    }
};

//var schema = nimnSchemaBuilder.build(data);
var schema = {
    "any_name": {
        "person": [
            {
                "phone": [
                    "number"
                ],
                "name": "string",
                "age": "number",
                "married": "string",
                "birthday": "date",
                "address": [
                    {
                        "city": "string",
                        "street": "string",
                        "buildingNo": "number",
                        "flatNo": "number"
                    }
                ]
            }
        ]
    }
};
var nimnInstance = new nimn();
nimnInstance.addDataHandler("date",function(val){
    return nimnDateparser.parse(val,true,true,true)
},function(val){
     return nimnDateparser.parseBack(val,true,true,true)
});
nimnInstance.addSchema(schema);
var nimndata = nimnInstance.encode(data);
//console.log(nimndata);
var bytes = [];
for (var i = 0; i < nimndata.length; ++i) {
    var code = nimndata.charCodeAt(i);
    bytes.push(nimndata.charCodeAt(i));
}


console.log("JSON : ", JSON.stringify(data).length);
console.log("JSON + gzip: ", zlib.gzipSync(JSON.stringify(data)).length);
console.log("JSON + deflate: ", zlib.deflateSync(JSON.stringify(data)).length);

console.log("Nimn : ",bytes.length);
console.log("Nimn + gzip: ",zlib.gzipSync(Buffer.from(bytes)).length);
console.log("Nimn + deflate: ",zlib.deflateSync(Buffer.from(bytes)).length);

//console.log(Buffer.from(bytes).toString());
//console.log(chars.chars);

var fs = require('fs');
fs.writeFile("bytes_output", Buffer.from(bytes) , 'utf8',function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});



var notepack = require('notepack.io');
var pack = notepack.encode(data);

console.log("Msgpack : ",pack.length);
console.log("Msgpack + gzip: ",zlib.gzipSync(pack).length);
console.log("Msgpack + deflate: ",zlib.deflateSync(pack).length);
//console.log("notepack message: ", pack.toString());
