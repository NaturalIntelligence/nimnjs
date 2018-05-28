var nimn = require("../src/nimn");
var chars = require("../src/chars").chars;

/*
1. chars.nilChar
2. chars.nilPremitive,
3. chars.missingChar,
4. chars.missingPremitive,
5. chars.boundryChar ,
6. chars.emptyChar,
7. chars.emptyValue,
8. chars.arrayEnd,
9. chars.objStart,
10.chars.arrStart
*/
describe('backslash in object ',function (){

    it("1. should sanitize the string when nil char exist in the string", function () {
        var schema = {
                "name" : "string",
                "marks" : "number"
        };

        var nimnEncoder = new nimn();

        var jData = {
            name : chars.nilChar+ "gupta" + chars.nilChar + "leo" + chars.nilChar,
            marks : 87.9
        }
        var expected = chars.objStart + "/" + chars.nilChar + 
            "gupta/" + chars.nilChar + "leo/" + chars.nilChar + chars.boundryChar + "87.9";

        nimnEncoder.addSchema(schema);
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected);
        result = nimnEncoder.decode(result);
        expect(result).toEqual(jData); 
    });

    it("2. should sanitize the string when nil premitive exist in the string", function () {
        var schema = {
                "name" : "string",
                "marks" : "number"
        };

        var nimnEncoder = new nimn();

        var jData = {
            name : chars.nilPremitive+ "gupta" + chars.nilPremitive + "leo" + chars.nilPremitive,
            marks : 87.9
        }
        var expected = chars.objStart + "/" + chars.nilPremitive + 
            "gupta/" + chars.nilPremitive + "leo/" + chars.nilPremitive + chars.boundryChar + "87.9";

        nimnEncoder.addSchema(schema);
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected);
        result = nimnEncoder.decode(result);
        expect(result).toEqual(jData); 
    });

    it("3. should sanitize the string when missing char exist in the string", function () {
        var schema = {
                "name" : "string",
                "marks" : "number"
        };

        var nimnEncoder = new nimn();

        var jData = {
            name : chars.missingChar+ "gupta" + chars.missingChar + "leo" + chars.missingChar,
            marks : 87.9
        }
        var expected = chars.objStart + "/" + chars.missingChar + 
            "gupta/" + chars.missingChar + "leo/" + chars.missingChar + chars.boundryChar + "87.9";

        nimnEncoder.addSchema(schema);
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected);
        result = nimnEncoder.decode(result);
        expect(result).toEqual(jData); 
    });

    it("4. should sanitize the string when missing premitive exist in the string", function () {
        var schema = {
                "name" : "string",
                "marks" : "number"
        };

        var nimnEncoder = new nimn();

        var jData = {
            name : chars.missingPremitive+ "gupta" + chars.missingPremitive + "leo" + chars.missingPremitive,
            marks : 87.9
        }
        var expected = chars.objStart + "/" + chars.missingPremitive + 
            "gupta/" + chars.missingPremitive + "leo/" + chars.missingPremitive + chars.boundryChar + "87.9";

        nimnEncoder.addSchema(schema);
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected);
        result = nimnEncoder.decode(result);
        expect(result).toEqual(jData); 
    });

    it("5. should sanitize the string when boundary char exist in the string", function () {
        var schema = {
                "name" : "string",
                "marks" : "number"
        };

        var nimnEncoder = new nimn();

        var jData = {
            name : chars.boundryChar+ "gupta" + chars.boundryChar + "leo" + chars.boundryChar,
            marks : 87.9
        }
        var expected = chars.objStart + "/" + chars.boundryChar + 
            "gupta/" + chars.boundryChar + "leo/" + chars.boundryChar + chars.boundryChar + "87.9";

        nimnEncoder.addSchema(schema);
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected);
        result = nimnEncoder.decode(result);
        expect(result).toEqual(jData); 
    });

    it("6. should sanitize the string when empty char exist in the string", function () {
        var schema = {
                "name" : "string",
                "marks" : "number"
        };

        var nimnEncoder = new nimn();

        var jData = {
            name : chars.emptyChar+ "gupta" + chars.emptyChar + "leo" + chars.emptyChar,
            marks : 87.9
        }
        var expected = chars.objStart + "/" + chars.emptyChar + 
            "gupta/" + chars.emptyChar + "leo/" + chars.emptyChar + chars.boundryChar + "87.9";

        nimnEncoder.addSchema(schema);
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected);
        result = nimnEncoder.decode(result);
        expect(result).toEqual(jData); 
    });
    
    it("7. should sanitize the string when empty char exist in the string", function () {
        var schema = {
                "name" : "string",
                "marks" : "number"
        };

        const testChar = chars.emptyValue;

        var nimnEncoder = new nimn();

        var jData = {
            name : testChar + "gupta" + testChar + "leo" + testChar,
            marks : 87.9
        }
        var expected = chars.objStart + "/" + testChar + 
            "gupta/" + testChar + "leo/" + testChar + chars.boundryChar + "87.9";

        nimnEncoder.addSchema(schema);
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected);
        result = nimnEncoder.decode(result);
        expect(result).toEqual(jData); 
    });

    
    it("8. should sanitize the string when arrayend char exist in the string", function () {
        var schema = {
                "name" : "string",
                "marks" : "number"
        };

        const testChar = chars.arrayEnd;

        var nimnEncoder = new nimn();

        var jData = {
            name : testChar + "gupta" + testChar + "leo" + testChar,
            marks : 87.9
        }
        var expected = chars.objStart + "/" + testChar + 
            "gupta/" + testChar + "leo/" + testChar + chars.boundryChar + "87.9";

        nimnEncoder.addSchema(schema);
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected);
        result = nimnEncoder.decode(result);
        expect(result).toEqual(jData); 
    });

    
    it("9. should sanitize the string when obj start char exist in the string", function () {
        var schema = {
                "name" : "string",
                "marks" : "number"
        };

        const testChar = chars.objStart;

        var nimnEncoder = new nimn();

        var jData = {
            name : testChar + "gupta" + testChar + "leo" + testChar,
            marks : 87.9
        }
        var expected = chars.objStart + "/" + testChar + 
            "gupta/" + testChar + "leo/" + testChar + chars.boundryChar + "87.9";

        nimnEncoder.addSchema(schema);
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected);
        result = nimnEncoder.decode(result);
        expect(result).toEqual(jData); 
    });

    
    it("10. should sanitize the string when arraystart char exist in the string", function () {
        var schema = {
                "name" : "string",
                "marks" : "number"
        };

        const testChar = chars.arrStart;

        var nimnEncoder = new nimn();

        var jData = {
            name : testChar + "gupta" + testChar + "leo" + testChar,
            marks : 87.9
        }
        var expected = chars.objStart + "/" + testChar + 
            "gupta/" + testChar + "leo/" + testChar + chars.boundryChar + "87.9";

        nimnEncoder.addSchema(schema);
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected);
        result = nimnEncoder.decode(result);
        expect(result).toEqual(jData); 
    });
});