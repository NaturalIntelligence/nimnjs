var Pbf = require('pbf');
var Signals = require('./signal.js').Signals;

// write
var obj = {
    name : 'A',
    features : {
        "name" : "amit",
        "age" : "29"
    },
    //salary : 123.456
    salary : 987654321
};
var pbf = new Pbf();
Signals.write(obj, pbf);
var buffer = pbf.finish();

console.log( buffer.length );

// read
var pbf_reader = new Pbf(buffer);
var outputObj = Signals.read(pbf_reader);

console.log( JSON.stringify(outputObj, null, 4) );
console.log( JSON.stringify(buffer.toString(), null, 4) );
