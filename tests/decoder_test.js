var nimn = require("../src/nimn");
var chars = require("../src/chars").chars;

describe("Nimn Decoder", function () {
    var schema = {
        type : "object",
        properties : {
            "name" : { type : "string"},
            "marks" : { type : "number"}
        }
    }
    
    it("should return null ", function () {
       
        var nimnEncoder = new nimn(schema);

        var result = nimnEncoder.getDecoder().decode(chars.nilChar);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(null); 
    });
    it(" should return undefined ", function () {
       
        var nimnEncoder = new nimn(schema);

        var result = nimnEncoder.getDecoder().decode(chars.missingChar);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(undefined); 
    });
});