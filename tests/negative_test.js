var nimn = require("../src/nimn");
var chars = require("../src/chars").chars;

describe("Nimn Encoder", function () {
    it("should error when invalid start of object ", function () {
        var schema = {
            type : "object",
            properties : {
                "age" : { type : "number"},
                "names" : {
                    type: "array",
                    properties : {
                        "name" : { type : "string" }
                    }
                }
            }
        }

        var nimnEncoder = new nimn(schema);

        var jData = {
            age : 32,
            names : ["amit", "kumar"]
        }

        var result = nimnEncoder.encode(jData);
        result = chars.arrStart + result.substr(1);
        expect(function(){
            nimnEncoder.getDecoder().decode(result);
        }).toThrow(); 
    });

    it("should error when invalid start of array ", function () {
        var schema = {
            type : "object",
            properties : {
                "age" : { type : "number"},
                "names" : {
                    type: "array",
                    properties : {
                        "name" : { type : "string" }
                    }
                }
            }
        }

        var nimnEncoder = new nimn(schema);

        var jData = {
            age : 32,
            names : ["amit", "kumar"]
        }

        var result = nimnEncoder.encode(jData);
        result =  result.substr(0,3) + chars.objStart + result.substr(5);
        expect(function(){
            nimnEncoder.getDecoder().decode(result);
        }).toThrow(); 
    });


    it("should error when multiple objects in an array ", function () {
        var schema = {
            type : "object",
            properties : {
                "age" : { type : "number"},
                "names" : {
                    type: "array",
                    properties : {
                        "name" : { type : "string" },
                        "name2" : { type : "string" }
                    }
                }
            }
        }
        
        expect(function(){
            var nimnEncoder = new nimn(schema);
        }).toThrow(); 
    });
});