var protobuf = require('protocol-buffers');
var fs = require('fs');
var Person = protobuf(fs.readFileSync('person.proto')).Person;



// write
var obj = {
    "user_name": "Martin ",
    "favourite_number": 1337,
    "data" : {
        "length" : 2,
        "text" : ["str1", "str2"]
    },
    "interests": ["daydreaming,daydreaming,daydreaming,daydreaming,daydreaming,daydreaming,daydreaming,daydreaming,daydreaming,daydreaming,daydreaming,daydreaming", "hacking"],
    "male" : true,
    "dt" : (new Date("Mon Feb 26 2018 17:42:17 GMT+0530 (IST)")).getTime(),
    "size" : 0,
    salary : 15.5
}


var buffer = Person.encode(obj);

console.log( buffer.length );

// read
var outputObj = Person.decode(buffer);

console.log( JSON.stringify(outputObj, null, 4) );
console.log( JSON.stringify(buffer, null, 4) );
console.log( JSON.stringify(buffer.toString(), null, 4) );
