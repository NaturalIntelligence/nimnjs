var nimn = require("../src/nimn");
var chars = require("../src/chars").chars;

describe("Nimn Decoder", function () {
    var schema = {
            "name" : "string",
            "marks" : "number"
    }
    
    it("should return null ", function () {
       
        var nimnEncoder = new nimn();
        nimnEncoder.updateSchema(schema);

        var result = nimnEncoder.decode(chars.nilChar);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(null); 
    });
    it(" should return undefined ", function () {
       
        var nimnEncoder = new nimn();
        nimnEncoder.updateSchema(schema);

        var result = nimnEncoder.decode(chars.missingChar);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(undefined); 
    });
});