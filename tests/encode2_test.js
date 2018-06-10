var parser = require("../src/parser"); 

describe("Nimn Encoder", function () {

    it("should append boundry char only if any of two consecutive fields are not nimn char ", function () {
        
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
                    , "not reading "+ parser.chars.missingPremitive +" book"
                    , "watching \\"+ parser.chars.nilPremitive +" movie"
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
        
        var expected = parser.chars.arrStart 
                + parser.chars.objStart 
                    + "somename" + parser.chars.boundaryChar
                    + "32" 
                    + parser.chars.yes // Order of the keys should be maintained as per schema not the data
                    + "I'll not tell you"
                    + parser.chars.arrStart
                        + parser.chars.nilPremitive
                        + "not reading \\"+ parser.chars.missingPremitive +" book"  +  parser.chars.boundaryChar
                        + "watching \\\\"+ parser.chars.nilPremitive +" movie"
                    + parser.chars.arrEnd
                    + parser.chars.objStart 
                            + "nimn" //No boundary char if next field is nimn char
                            +  parser.chars.missingPremitive
                            + "rocking" //last field can not have boundary char
                    + parser.chars.objEnd
                + parser.chars.objEnd
                + parser.chars.emptyChar
                + parser.chars.objStart 
                    + "somename" 
                    + parser.chars.missingPremitive
                    + parser.chars.nilPremitive // Order of the keys should be maintained as per schema not the data
                    + "I'll not tell you"
                    + parser.chars.nilChar
                    + parser.chars.nilChar
                + parser.chars.objEnd
            + parser.chars.arrEnd;
        
        assert(newSchema,jData, expected);

        assert(newSchema,[], parser.chars.emptyChar);
        assert(newSchema,null, parser.chars.nilChar);

    }); 

    function assert(schema,jData, expected){
        var result = parser.parse(schema, jData);
        
        expect(result).toEqual(expected);
        result = parser.parseBack(schema, result);
        //console.log(JSON.stringify(result, null, 4));
        expect(result).toEqual(jData); 
    }
});
