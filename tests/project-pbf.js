var Pbf = require('pbf');
var People = require('./project.js').People;

// write
var obj = {
    person : [
        {
            name : "A",
            projectDetail : [
                {
                    name : "A",
                    age : 33,
                    male : true
                },
                {
                    name : "C",
                    age : 33,
                    male : true
                }
            ]
        },
        {
            name : "B",
            projectDetail : [
                {
                    name : "B",
                    age : 33,
                    male : false
                }
            ]
        }
    ]
};
var pbf = new Pbf();
People.write(obj, pbf);
var buffer = pbf.finish();

console.log( buffer.length );

// read
var pbf_reader = new Pbf(buffer);
var outputObj = People.read(pbf_reader);

console.log( JSON.stringify(outputObj, null, 4) );
console.log( JSON.stringify(buffer.toString(), null, 4) );
