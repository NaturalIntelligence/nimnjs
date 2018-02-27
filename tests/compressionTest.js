var nimn = require("../src/nimn");
var chars = require("../src/chars");
var nimnSchemaBuilder = require("nimn_schema_builder");
var nimnDateparser = require("nimn-date-parser");


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
    "type": "object",
    "properties": {
        "any_name": {
            "type": "object",
            "properties": {
                "person": {
                    "type": "array",
                    "properties": {
                        "item": {
                            "type": "object",
                            "properties": {
                                "phone": {
                                    "type": "array",
                                    "properties": {
                                        "item": {
                                            "type": "number"
                                        }
                                    }
                                },
                                "name": {
                                    "type": "string"
                                },
                                "age": {
                                    "type": "number"
                                },
                                "married": {
                                    "type": "string"
                                },
                                "birthday": {
                                    "type": "date"
                                },
                                "address": {
                                    "type": "array",
                                    "properties": {
                                        "item": {
                                            "type": "object",
                                            "properties": {
                                                "city": {
                                                    "type": "string"
                                                },
                                                "street": {
                                                    "type": "string"
                                                },
                                                "buildingNo": {
                                                    "type": "number"
                                                },
                                                "flatNo": {
                                                    "type": "number"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
var nimnInstance = new nimn(schema);
nimnInstance.configDataType("date",function(val){
    return nimnDateparser.parse(val,true,true,true)
},function(val){
     return nimnDateparser.parseBack(val,true,true,true)
});

var nimndata = nimnInstance.encode(data);
console.log(nimndata);
var bytes = [];
for (var i = 0; i < nimndata.length; ++i) {
    var code = nimndata.charCodeAt(i);
    bytes.push(nimndata.charCodeAt(i));
}

console.log(bytes.length);
console.log(Buffer.from(bytes).toString());
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
console.log("notepack message: ", pack.toString());
