var fs = require('fs');
var path = require('path');
var Benchmark = require('benchmark');
var suite = new Benchmark.Suite("JSON transformation benchmark");

var nimn = require("../src/nimn");

var schema = [{
  "name" : "string",
  "age" : "number",
  "isHuman" : "boolean",
  "address" : "string",
  "hobbies" : ["string"],
  "project" : {
      "title" : "string",
      "description" : "string",
      "status" : "string"
  }
}];

var nimnEncoder = new nimn();
nimnEncoder.addSchema(schema);

var data = JSON.parse(fs.readFileSync( path.join( __dirname,"bigjson")));

var nimnStr = nimnEncoder.encode(data); 
var jsonStr = JSON.stringify(data);
fs.writeFileSync(path.join( __dirname,"bignimn"),nimnStr);
console.log("NIMN string" + nimnStr.length);
console.log("JSON string" + jsonStr.length);

suite
.add('JSON.stringify', function() {
    JSON.stringify(data); 
})
.add('nimn Encode', function() {
  nimnEncoder.encode(data); 
})

.add('nimn Decode', function() {
  nimnEncoder.decode(nimnStr); 
}) 
.add('JSON.parse', function() {
    JSON.parse(jsonStr); 
})

.on('start',function(){
	console.log("Running Suite: " + this.name);
})
.on('error',function(e){
	console.log("Error in Suite: ",e);
})
.on('abort',function(e){
	console.log("Aborting Suite: " + this.name);
})
.on('complete', function() {
  for (var j = 0; j < this.length; j++) {
    console.log(this[j].name + " : " +   this[j].hz + " requests/second");
  }
})
.run({ 'async': true });