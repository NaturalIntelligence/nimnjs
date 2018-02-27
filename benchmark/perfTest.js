var Benchmark = require('benchmark');
var suite = new Benchmark.Suite("JSON transformation benchmark");

var nimn = require("../src/nimn");
var schema = {
        "persons" : [{
            "name" : "string" ,
            "age" : "number" ,
            "registered" : "boolean" ,
            "calldetails" : [ {
                "from" : "string" ,
                "to" : "string" ,
                "when" : "date"
            }]
        }]
    };

var nimnEncoder = new nimn(schema);

var data = { 
    persons : [
        {
            "name" : "somename",
            "age": 30,
            "registered" : true,
            "calldetails" : [
                {
                    "from" : "123456789",
                    "to" : "123456789",
                    "when" : "2018-02-23T10:12:30.041Z"
                },
                {
                    "from" : "123456789",
                    "to" : "123456789",
                    "when" : "2018-02-23T10:12:30.041Z"
                }
            ]
        },
        {
            "name" : "somename",
            "age": 30,
            //"registered" : true,
            "calldetails" : [
                {
                    "from" : "123456789",
                    "to" : "123456789",
                    "when" : "2018-02-23T10:12:30.041Z"
                },
                {
                    "from" : "123456789",
                    "to" : "123456789",
                    "when" : "2018-02-23T10:12:30.041Z"
                }
            ]
        },
        {
            "name" : "somename",
            "age": 30,
            //"registered" : true,
            "calldetails" : [
                {
                    "from" : "123456789",
                    "to" : "123456789",
                    "when" : "2018-02-23T10:12:30.041Z"
                },
                {
                    "from" : "123456789",
                    "to" : "123456789",
                    "when" : "2018-02-23T10:12:30.041Z"
                }
            ]
        },
        {
            "name" : "somename",
            "age": 30,
            //"registered" : true,
            "calldetails" : [
                {
                    "from" : "123456789",
                    "to" : "123456789",
                    "when" : "2018-02-23T10:12:30.041Z"
                },
                {
                    "from" : "123456789",
                    "to" : "123456789",
                    "when" : "2018-02-23T10:12:30.041Z"
                }
            ]
        },
        {
            "name" : "somename",
            "age": 30,
            //"registered" : true,
            "calldetails" : [
                {
                    "from" : "123456789",
                    "to" : "123456789",
                    "when" : "2018-02-23T10:12:30.041Z"
                },
                {
                    "from" : "123456789",
                    "to" : "123456789",
                    "when" : "2018-02-23T10:12:30.041Z"
                }
            ]
        },
        {
            "name" : "somename",
            "age": 30,
            //"registered" : true,
            "calldetails" : [
                {
                    "from" : "123456789",
                    "to" : "123456789",
                    "when" : "2018-02-23T10:12:30.041Z"
                },
                {
                    "from" : "123456789",
                    "to" : "123456789",
                    "when" : "2018-02-23T10:12:30.041Z"
                }
            ]
        },
        {
            "name" : "somename",
            "age": 30,
            //"registered" : true,
            "calldetails" : [
                {
                    "from" : "123456789",
                    "to" : "123456789",
                    "when" : "2018-02-23T10:12:30.041Z"
                },
                {
                    "from" : "123456789",
                    "to" : "123456789",
                    "when" : "2018-02-23T10:12:30.041Z"
                }
            ]
        }
    ]
};

const fastJson = require('fast-json-stringify')
//const stringify = fastJson(schema);

var nimnStr = nimnEncoder.encode(data); 
var jsonStr = JSON.stringify(data);
//var fastJsonStr = stringify(data); 
console.log("NIMN string" + nimnStr.length);
console.log("JSON string" + jsonStr.length);
//console.log("fast JSON string" + fastJsonStr.length);
var cbor = require('cbor');
var cborArr = cbor.encode(data);
console.log("CBOR arr: ", cborArr.length);
var cborData = cbor.decode(cborArr);

var msgpack = require('msgpack');
var msgPackArr = msgpack.pack(data);
console.log("MSGPACK arr: ", msgPackArr.length);

var notepack = require('notepack.io');
var pack = notepack.encode(data);
console.log("notepack message: ", pack.length);

suite
.add('JSON.stringify', function() {
    JSON.stringify(data); 
})
.add('nimn Encode', function() {
  nimnEncoder.encode(data); 
})
/* .add('notepack messagepack encode', function() {
    notepack.encode(data);
}) */
/* .add('cbore encode', function() {
    cbor.encode(data);
})
.add('msgpack pack', function() {
    cbor.encode(data);
})
 */
/* .add('fast-json-stringify', function() {
    stringify(data); 
}) */
.add('nimn Decode', function() {
  nimnEncoder.getDecoder().decode(nimnStr); 
}) 
.add('JSON.parse', function() {
    JSON.parse(jsonStr); 
})
/* .add('notepack messagepack decode', function() {
    notepack.decode(pack); 
}) */
/* .add('cbore decode', function() {
    cbor.decode(cborArr);
})
.add('msgpack unpack', function() {
    msgpack.unpack(msgPackArr);
})
 */
.on('start',function(){
	console.log("Running Suite: " + this.name);
})
.on('error',function(e){
	console.log("Error in Suite: ",e);
})
.on('abort',function(e){
	console.log("Aborting Suite: " + this.name);
})
/*.on('cycle',function(event){
	console.log("Suite ID:" + event.target.id);
})*/
// add listeners 
.on('complete', function() {
  for (var j = 0; j < this.length; j++) {
    console.log(this[j].name + " : " +   this[j].hz + " requests/second");
  }
})
// run async 
.run({ 'async': true });