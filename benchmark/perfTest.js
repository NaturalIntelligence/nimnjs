var Benchmark = require('benchmark');
var suite = new Benchmark.Suite("XML Parser benchmark");

var nimn = require("../src/nimn");
var schema = {
    "title": "root",
    type : "object",
    properties : {
        "names1" : {
            type: "object",
            properties : {
                "name" : { type : "boolean" },
                "names1" : {
                    type: "object",
                    properties : {
                        "name" : { type : "string" }
                    }
                }
            }
        },
        "names2" : {
            type: "object",
            properties : {
                "name" : { type : "string" }
            }
        }
    }
}

var nimnEncoder = new nimn(schema);
//console.log(schema);

var data = {
    names1 : {
        name: true,
        names1 : {
            name: "amit"
        }
    },
    names2 : {
        name: "gupta",
    }
}

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

/* 
var toArr = function(obj){
    Object.keys(obj).map(function (key) { 
        if(typeof key === "object" ) return toArr(key); 
        return obj[key]; 
    });
}
console.log("flat object: " + Object.values(data));
 */
suite
.add('nimn Encode', function() {
  nimnEncoder.encode(data); 
})
.add('JSON.stringify', function() {
    JSON.stringify(data); 
})
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