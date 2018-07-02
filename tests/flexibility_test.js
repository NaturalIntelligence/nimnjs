var parser = require("../src/nimn"); 
var chars = require("../src/common").chars; 

describe("Nimn Decoder", function () {

    it("should decode if extra fields are present in last", function () {
        
        var schema = {
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
          
        var newSchema = parser.buildSchema(schema);

        var jData = [{
                "name" : "somename",
                "isHuman" : true,
                "age": 32,
                "address" : "I'll not tell you",
                hobbies : [ 
                    null
                    , "not reading "+ chars.missingPremitive +" book"
                    , "watching \\"+ chars.nilPremitive +" movie"
                ],
                project : {
                    title : "nimn",
                    //description : "it is 80% smaller",
                    status : "rocking"
                }
            },{
            },{
                "name" : "somename",
                "isHuman" : null,
                "address" : "I'll not tell you",
                hobbies : null,
                project : null
            }
        ];
        
        var dataWithExtraFields = chars.arrStart 
                + chars.objStart 
                    + "somename" + chars.boundaryChar
                    + "32" 
                    + chars.yes // Order of the keys should be maintained as per schema not the data
                    + "I'll not tell you"
                    + chars.arrStart
                        + chars.nilPremitive
                        + "not reading \\"+ chars.missingPremitive +" book"  +  chars.boundaryChar
                        + "watching \\\\"+ chars.nilPremitive +" movie"
                    + chars.arrEnd
                    + chars.objStart 
                            + "nimn" //No boundary char if next field is nimn char
                            +  chars.missingPremitive
                            + "rocking" //last field can not have boundary char
                    + chars.objEnd
                    + "I'm extra data"
                + chars.objEnd
                + chars.emptyChar
                + chars.objStart 
                    + "somename" 
                    + chars.missingPremitive
                    + chars.nilPremitive // Order of the keys should be maintained as per schema not the data
                    + "I'll not tell you"
                    + chars.nilChar
                    + chars.nilChar
                + chars.objEnd
            + chars.arrEnd;
        
        result = parser.parse(newSchema, dataWithExtraFields);
        //console.log(JSON.stringify(result, null, 4));
        expect(result).toEqual(jData ); 
    }); 

    it("should decode data encoded with different schema if extra fields are present in last", function () {
        
        var oldStructure = { //has less fields : v1
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
                }
              ]
            }
        }

        var newStructure = {
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
          
        var oldSchema = parser.buildSchema(oldStructure);
        var newSchema = parser.buildSchema(newStructure);

        var jData = [{
                "name" : "somename",
                "isHuman" : true,
                "age": 32,
                "address" : "I'll not tell you",
                hobbies : [ 
                    null
                    , "not reading "+ chars.missingPremitive +" book"
                    , "watching \\"+ chars.nilPremitive +" movie"
                ],
                project : {
                    title : "nimn",
                    //description : "it is 80% smaller",
                    status : "rocking"
                }
            },{
            },{
                "name" : "somename",
                "isHuman" : null,
                "address" : "I'll not tell you",
                hobbies : null,
                project : null
            }
        ];
        
        var oldNimnData = parser.stringify(oldSchema, jData);
        var newNimnData = parser.stringify(newSchema, jData);

        parser.parse(oldSchema, oldNimnData);
        parser.parse(newSchema, oldNimnData);

        parser.parse(newSchema, newNimnData);
        parser.parse(oldSchema, newNimnData);

    }); 
});
