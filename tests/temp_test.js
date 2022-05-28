var parser = require("../src/nimn");
var chars = require("../src/common").chars;  

describe("Nimn Encoder", function () {

    it("should append boundry char only if any of two consecutive fields are not nimn char ", function () {
        
        var schema = {
          "type": "map",
          "detail": [
              {
                  "type": "map",
                  "detail": [
                      {
                          "type": "list",
                          "detail": {
                              "type": "map",
                              "detail": [
                                  {
                                      "type": "list",
                                      "detail": {
                                          "type": "number"
                                      },
                                      "name": "phone"
                                  },
                                  {
                                      "type": "string",
                                      "name": "name"
                                  },
                                  {
                                      "type": "number",
                                      "name": "age"
                                  },
                                  {
                                      "type": "string",
                                      "name": "married"
                                  },
                                  {
                                      "type": "string",
                                      "name": "birthday"
                                  },
                                  {
                                      "type": "varmap",
                                      "detail": {
                                              "type": "string"
                                        },
                                      "name": "address"
                                  }
                              ]
                          },
                          "name": "person"
                      }
                  ],
                  "name": "any_name"
              }
          ]
      }
          
          var newSchema = parser.buildSchema(schema);

        var jData = {
          "any_name": {
              "person": [
                  {
                      "phone": [
                          122233344550,
                          122233344551
                      ],
                      "name": "Jack",
                      "age": 33,
                      "married": "Yes",
                      "birthday": "Wed, 28 Mar 1979 12:13:14 +0300",
                      "address": {
                          "city": "New York",
                          "street": "Park Ave",
                          "buildingNo": '1',
                          "flatNo": '1'
                      }
                  },
                  /* {
                      "phone": [
                          122233344553,
                          122233344554
                      ],
                      "name": "Boris",
                      "age": 34,
                      "married": "Yes",
                      "birthday": "Mon, 31 Aug 1970 02:03:04 +0300",
                      "address": {
                          "city": "Moscow",
                          "street": "Kahovka",
                          "buildingNo": 1,
                          "flatNo": 2
                      }
                  } */
              ]
          }
      };
        
        var expected = chars.arrStart 
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
        
        assert(newSchema,jData, expected);
    }); 

    function assert(schema,jData, expected, expectedjData){
        var result = parser.stringify(schema, jData);
        console.log(result)
        //expect(result).toEqual(expected);
        result = parser.parse(schema, result);
        //console.log(JSON.stringify(result, null, 4));
        expect(result).toEqual(expectedjData || jData ); 
    }
});
