var parser = require("../src/nimn"); 

describe("Nimn ", function () {
    var schema = {
        type : "map",
        detail : [
            {
                name : "age",
                type : "number"
            },{
                name : "name",
                type : "list",
                detail : {
                    type : "string"
                }
            }
        ]
    }
    var newSchema = parser.buildSchema(schema);
    //console.log( JSON.stringify( newSchema, null, 4) );

    it("should error when invalid start of object ", function () {
        
        var jData = {
            age : 32,
            names : ["amit", "kumar"]
        }
        
        var nimnData = parser.stringify(newSchema, jData);
        nimnData = parser.chars.arrStart + nimnData.substr(1);
        
        expect(function(){
            parser.parse(newSchema, nimnData);
        }).toThrow(); 
    });

    it("should error when invalid start of array ", function () {

        var jData = {
            age : 32,
            names : ["amit", "kumar"]
        }

        var nimnData = parser.stringify(newSchema, jData);
        nimnData =  nimnData.substr(0,3) + parser.chars.objStart + nimnData.substr(5);

        expect(function(){
            parser.parse(newSchema, nimnData);
        }).toThrow(); 
    });


    it("should error when empty etring is provided to decode ", function () {
        var schema = {
            "age": "number",
            "names" : ["string"]
        }

        expect(function(){
            parser.parse(newSchema, "");
        }).toThrow(); 
    });
});