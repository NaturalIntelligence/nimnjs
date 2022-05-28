var Pbf = require('pbf');
var Person = require('./person.js').Person;



// write
var obj = {
    "user_name": "Martin ",
    "favourite_number": 1337,
    "data" : {
        "length" : 2,
        "text" : ["str1", "str2"]
    },
    "interests": ["daydreaming,daydreaming,daydreaming,daydreaming,daydreaming,daydreaming,daydreaming,daydreaming,daydreaming,daydreaming", "hacking"],
    "male" : true,
    "dt" : (new Date("Mon Feb 26 2018 17:42:17 GMT+0530 (IST)")).getTime(),
    "Size" : 0,
    salary : 15.5
}



var pbf = new Pbf();
Person.write(obj, pbf);
var buffer = pbf.finish();

console.log( buffer.length );

// read
var pbf_reader = new Pbf(buffer);
var outputObj = Person.read(pbf_reader);

console.log( JSON.stringify(outputObj, null, 4) );
console.log( JSON.stringify(buffer.toString(), null, 4) );


// ---------------- Nimn
var parser = require("../src/nimn.js");
var nimnSchemaBuilder = require("nimn_schema_builder");
var schema = nimnSchemaBuilder.build(obj);
var newSchema = parser.buildSchema(schema,false);
var nimnData = parser.stringify(newSchema, obj);

//console.log( schema );
//console.log( nimnData );
//console.log( nimnData.length );
