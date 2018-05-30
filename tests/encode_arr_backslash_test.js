var nimn = require("../src/nimn");
var chars = require("../src/chars").chars;
var char = require("../src/util").char;

describe('', function(){
    it("backslash in array should be encoded and decoded correctly", function () {
        var schema = {
            "age": "number",
            "names" : ["string" ],
            "str": "string",
            "names2" : ["string" ],
            "bool": "boolean",
            "names3" : ["string" ]
        }

        var nimnEncoder = new nimn();
        nimnEncoder.addSchema(schema);

         var jData = {
            age : 32,
            names : [ chars.arrStart + "amit" + chars.arrayEnd, 
                chars.boundryChar + "kumar" + chars.emptyChar],
        }
        var expected = chars.objStart
            + "32" 
            + chars.arrStart + '\\' + chars.arrStart
            + "amit" + '\\' + chars.arrayEnd + chars.boundryChar 
            + '\\' + chars.boundryChar + "kumar" 
            + '\\' + chars.emptyChar + chars.arrayEnd
            + chars.missingPremitive + chars.missingChar
            + chars.missingPremitive + chars.missingChar;

        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
        result = nimnEncoder.decode(result);
        expect(result).toEqual(jData); 

         var jData = {
            age : 32,
            names : [chars.missingChar + "amit" + chars.nilPremitive, 
                chars.nilChar + "kumar" + chars.arrayEnd],
            names2 : ["amit2", "kumar2"],
            bool: false
        }
        var expected = chars.objStart + "32" 
            + chars.arrStart + '\\' + chars.missingChar
            + "amit" + '\\' + chars.nilPremitive + chars.boundryChar 
            + '\\' + chars.nilChar + "kumar" + '\\' + chars.arrayEnd + chars.arrayEnd 
            + chars.missingPremitive
            + chars.arrStart 
            + "amit2" + chars.boundryChar + "kumar2" + chars.arrayEnd 
            + char(183) + chars.missingChar;

        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
        result = nimnEncoder.decode(result);
        expect(result).toEqual(jData);   
    }); 

});