var nimn = require("../src/nimn");
var chars = require("../src/chars").chars;

describe("Nimn ", function () {
    it("should error when invalid start of object ", function () {
        var schema = {
                "age": "number",
                "names" : ["string"]
        }

        var nimnEncoder = new nimn();
        nimnEncoder.addSchema(schema);


        var jData = {
            age : 32,
            names : ["amit", "kumar"]
        }

        var result = nimnEncoder.encode(jData);
        result = chars.arrStart + result.substr(1);
        expect(function(){
            nimnEncoder.decode(result);
        }).toThrow(); 
    });

    it("should error when invalid start of array ", function () {
        var schema = {
            "age": "number",
            "names" : ["string"]
        }

        var nimnEncoder = new nimn();
        nimnEncoder.addSchema(schema);


        var jData = {
            age : 32,
            names : ["amit", "kumar"]
        }

        var result = nimnEncoder.encode(jData);
        result =  result.substr(0,3) + chars.objStart + result.substr(5);
        expect(function(){
            nimnEncoder.decode(result);
        }).toThrow(); 
    });


    it("should error when empty etring is provided to decode ", function () {
        var schema = {
            "age": "number",
            "names" : ["string"]
        }
        
        var nimnEncoder = new nimn();
        nimnEncoder.addSchema(schema);

        expect(function(){
            nimnEncoder.decode("");
        }).toThrow(); 
    });
});