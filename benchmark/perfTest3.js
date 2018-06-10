var fs = require('fs');
var path = require('path');
var Benchmark = require('benchmark');
var suite = new Benchmark.Suite("JSON transformation benchmark");

var parser = require("../src/nimn");

var schema = {
  //name : "person",
  type : "list",
  detail : {
    type : "map",
    detail : [{
        name : "name",
        type : "string"
      },{
        name : "age",
        type : "number"
      },{
        name : "isHuman",
        type : "boolean"
      },{
        name : "address",
        type : "string"
      },{
        name : "hobbies",
        type : "list",
        detail : {
          type : "string"
        }
      },{
        name : "project",
        type : "map",
        detail: [{
            name: "title",
            type : "string"
          },{
            name: "description",
            type : "string"
          },{
            name: "status",
            type : "string"
          }
        ]
      }
    ]
  }
}

var data = [{
          "name" : "somename",
          "age": 30,
          "isHuman" : true,
          "address" : "I'll not tell you",
          hobbies : ["music","game"],
          project : {
            title : "nimn",
            description : "save 80% space",
            status : "rocking"
          }
      },{
          "name" : "somename2",
          "age": 32,
          "isHuman" : true,
          "address" : "Go to the hell",
          hobbies : ["music","coding"],
          project : {
            title : "fxp",
            description : "faster",
            status : "in prod"
          }
      },{
        "name" : "somename3",
        "age": 33,
        "isHuman" : true,
        "address" : "Go to the hell",
        hobbies : ["music","coding"],
        project : {
          title : "fxp2",
          description : "faster",
          status : "in prod"
        }
      },{
        "name" : "somename3",
        "age": 33,
        "isHuman" : true,
        "address" : "Go to the hell",
        hobbies : ["music","coding"],
        project : {
          title : "fxp2",
          description : "faster",
          status : "in prod"
        }
      },{
        "name" : "somename3",
        "age": 33,
        "isHuman" : true,
        "address" : "Go to the hell",
        hobbies : ["music","coding"],
        project : {
          title : "fxp2",
          description : "faster",
          status : "in prod"
        }
      }
  ];

var newSchema = parser.buildSchema(schema,false);
var nimnData = parser.stringify(newSchema, data);
//console.log(nimnData)
var simplifiedForm = nimnData.replace(/\xB6/g,'{');
simplifiedForm = simplifiedForm.replace(/\xB4/g,'}');
simplifiedForm = simplifiedForm.replace(/\xBB/g,'[');
simplifiedForm = simplifiedForm.replace(/\xB9/g,']');
simplifiedForm = simplifiedForm.replace(/\xB3/g,'|');
//console.log(simplifiedForm);
var jsObj = parser.parse(newSchema, nimnData);

var jsonStr =  JSON.stringify(data); 

suite
.add('JSON.stringify', function() {
    JSON.stringify(data); 
})
.add('nimn Encode', function() {
  parser.stringify(newSchema, data);
})

.add('JSON.parse', function() {
    JSON.parse(jsonStr); 
})
.add('nimn Decode', function() {
  parser.parse(newSchema, nimnData);
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