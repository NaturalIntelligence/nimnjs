var parser = require("../src/nimn"); 

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

    it("should return default value for undefined ", function () {
        
        var schema = {
              type : "map",
              detail : [{
                  name : "name",
                  type : "string"
                },{
                  name : "age",
                  type : "number",
                  default : 45
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
                      type : "string",
                      default: "As usual fast"
                    },{
                      name: "status",
                      type : "string"
                    }
                  ]
                }
              ]
            }
          
          var newSchema = parser.buildSchema(schema);

        var jData = {
            "name" : "somename",
            hobbies : null,
            project : {
                title : "nimn",
                //description : "it is 80% smaller",
                status : "rocking"
            }
        };

        var expectedjData = {
            "name" : "somename",
            age : 45,
            hobbies : null,
            project : {
                title : "nimn",
                description : "As usual fast",
                status : "rocking"
            }
        };
        
        var expected = parser.chars.objStart 
                + "somename" 
                + parser.chars.missingPremitive
                + parser.chars.missingPremitive
                + parser.chars.missingPremitive
                + parser.chars.nilChar
                + parser.chars.objStart 
                        + "nimn" //No boundary char if next field is nimn char
                        +  parser.chars.missingPremitive
                        + "rocking" //last field can not have boundary char
                + parser.chars.objEnd
            + parser.chars.objEnd;
        
        assert(newSchema,jData, expected, expectedjData);

        assert(newSchema,{}, parser.chars.emptyChar);
        assert(newSchema,null, parser.chars.nilChar);

    }); 

    it("should append field value separator for dynamic maps ", function () {
        
    var schema = {
        type : "varmap",
        detail : {
          type : "map",
          detail : [{
              name : "category",
              type : "string"
            },{
              name : "attributes",
              type : "varmap",
              detail : {
                type : "string"
              }
            },{
              name : "bbox",
              type : "map",
              detail: [{
                  name: "x",
                  type : "number"
                },{
                  name: "y",
                  type : "number"
                },{
                  name: "width",
                  type : "number"
                },{
                  name: "height",
                  type : "number"
                }
              ]
            }
          ]
        }
    }
      
    var newSchema = parser.buildSchema(schema);

    var jData = {
      "face1" : {
        category : "face",
        attributes : {
          gender : "male",
          age : "32"
        },
        bbox : {
          x : 0,
          y: 0,
          width: 100,
          height: 100
        }
      },
      "face2" : {
        category : "face",
        attributes : {
          gender : "female",
          age : "31"
        },
        bbox : {
          x : 125,
          y: 70,
          width: 70,
          height: 80
        }
      },
    };
    
    var expected = parser.chars.arrStart 
            + "face1"
            + parser.chars.fieldNameBoundaryChar 
            + parser.chars.objStart
            + "face" 
            + parser.chars.arrStart
              + "gender" + parser.chars.fieldNameBoundaryChar + "male"
              + parser.chars.boundaryChar
              + "age" + parser.chars.fieldNameBoundaryChar + "32"
            + parser.chars.arrEnd
            + parser.chars.objStart
                + "0" +  parser.chars.boundaryChar
                + "0" +  parser.chars.boundaryChar
                + "100" +  parser.chars.boundaryChar
                + "100" 
            + parser.chars.objEnd
            + parser.chars.objEnd

            + "face2"
            + parser.chars.fieldNameBoundaryChar 
            + parser.chars.objStart
            + "face" 
            + parser.chars.arrStart
              + "gender" + parser.chars.fieldNameBoundaryChar + "female"
              + parser.chars.boundaryChar
              + "age" + parser.chars.fieldNameBoundaryChar + "31"
            + parser.chars.arrEnd
            + parser.chars.objStart
                + "125" +  parser.chars.boundaryChar
                + "70" +  parser.chars.boundaryChar
                + "70" +  parser.chars.boundaryChar
                + "80" 
            + parser.chars.objEnd
            + parser.chars.objEnd
        + parser.chars.arrEnd;
    
    assert(newSchema,jData, expected);

    assert(newSchema,{}, parser.chars.emptyChar);
    assert(newSchema,null, parser.chars.nilChar);

  }); 

    function assert(schema,jData, expected, expectedjData){
        var result = parser.stringify(schema, jData);
        //console.log(result)
        expect(result).toEqual(expected);
        result = parser.parse(schema, result);
        //console.log(JSON.stringify(result, null, 4));
        expect(result).toEqual(expectedjData || jData ); 
    }
});
