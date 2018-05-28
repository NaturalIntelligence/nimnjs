var nimn = require("../src/nimn");
var chars = require("../src/chars").chars;

describe("Nimn Encoder", function () {

    it("should append boundry char if last field can have dynamic value", function () {
        var schema = {
                "name" : "string",
                "marks" : "number"
        };

        var nimnEncoder = new nimn();

        var jData = {
            name : "gupta",
            marks : 87.9
        }
        var expected = chars.objStart + "gupta" + chars.boundryChar + "87.9";

        nimnEncoder.addSchema(schema);
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected);
        result = nimnEncoder.decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 
    });

    it("should append undefined or null char without boundry char if last field undefined or null", function () {
        var schema = {
            "name" : "string",
            "age" : "number"
        };

        var nimnEncoder = new nimn();
        nimnEncoder.addSchema(schema);

        var jData = {
            age : 32
        }
        //var expected = chars.objStart + chars.missingPremitive + "32";
        var expected = chars.objStart + chars.missingPremitive + "32";

        
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected);
        result = nimnEncoder.decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 

        var jData = {
            name : null,
            age : 32
        }
        var expected = chars.objStart + chars.nilPremitive + "32";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected);
        result = nimnEncoder.decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 

    }); 

    it("should append boundry char if last field can have dynamic value and not undefined or null", function () {
        var schema = {
            "name" : {
                "first" : "string" ,
                "middle" : "string" ,
                "last" : "string"
            },
            "age" : "number"
        };

        var nimnEncoder = new nimn();
        nimnEncoder.addSchema(schema);

        var jData = {
            name : { first : null , middle: "kumar", last: "gupta"} ,
            age : 32
        }
        var expected = chars.objStart + chars.objStart + chars.nilPremitive  + "kumar" + chars.boundryChar + "gupta"
            + chars.boundryChar
            + "32";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected);
        result = nimnEncoder.decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 
    });

    it("should not append boundry char if last field can have dynamic value but it is undefined or null", function () {
        var schema = {
            "name" : {
                "first" : "string" ,
                "middle" : "string" ,
                "last" : "string"
            },
            "age" : "number"
        };

        var nimnEncoder = new nimn();
        nimnEncoder.addSchema(schema);
        
        var jData = {
            name : { first : null , middle: "kumar", last: null} ,
            age : 32
        }
        var expected = chars.objStart + chars.objStart + chars.nilPremitive + "kumar" + chars.nilPremitive
            + "32";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected);
        result = nimnEncoder.decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 

        var jData = {
            name : { first : null , middle: "kumar"} ,
            age : 32
        }
        var expected = chars.objStart + chars.objStart + chars.nilPremitive + "kumar" + chars.missingPremitive
            + "32";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected);
        result = nimnEncoder.decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 

        var jData = {
            name : null ,
            age : 32
        }
        var expected = chars.objStart + chars.nilChar + "32";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected);
        result = nimnEncoder.decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 

        var jData = {
            //name : {},
            age : 32
        }
        var expected = chars.objStart + chars.missingChar + "32";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected);
        result = nimnEncoder.decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 

    });

    it("should not append boundry char if last field is empty object", function () {
        var schema = {
            "name" : {
                "first" : "string" ,
                "middle" : "string" ,
                "last" : "string"
            },
            "age" : "number"
        };

        var nimnEncoder = new nimn();
        nimnEncoder.addSchema(schema);

        var jData = {
            name : {},
            age : 32
        }
        var expected = chars.objStart + chars.emptyChar + "32";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
        result = nimnEncoder.decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 
    });

    it("should encode data in the order it defines in schema", function () {

        var project = {
            "name" :  "string",
            "description" : "string"
        }
        
        var schema = {
            "name" : {
                    "first" : "string",
                    "middle" : "string",
                    "last" : "string"
            },
            "projects" : [ project ],
            "age" : "number"
        }
        
        var jData = {
            age : 32,
            name : { first : null , middle: "kumar", last: "gupta"} ,
            projects : [
                {
                    name : "Stubmatic",
                    description : "QA friendly tool to mock HTTP(s) calls"
                },{
                    name : "java aggregator",
                    description: "1"
                }
            ]
        }

        var expected = chars.objStart + chars.objStart + chars.nilPremitive + "kumar" + chars.boundryChar + "gupta"
            + chars.arrStart 
            + chars.objStart + "Stubmatic" + chars.boundryChar + "QA friendly tool to mock HTTP(s) calls"
            + chars.objStart + "java aggregator" + chars.boundryChar + "1"
            + chars.arrayEnd
            + "32";

        var nimnEncoder = new nimn();
        nimnEncoder.addSchema(schema);
        var result = nimnEncoder.encode(jData);
        //console.log(result.length);
        //console.log(result);
        expect(result).toEqual(expected);
        result = nimnEncoder.decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 
    });

    it("should not separate empty values with boundryChar ", function () {

        var project = {
            "name" :  "string",
            "summary" : "string",
            "detail" : "string"
        }
        
        var jData = {
            "name" :  "",
            "summary" : "",
            "detail" : ""
        }

        var expected = chars.objStart + chars.emptyValue + chars.emptyValue + chars.emptyValue;

        var nimnEncoder = new nimn();
        nimnEncoder.addSchema(project);
        var result = nimnEncoder.encode(jData);
        //console.log(result.length);
        //console.log(result);
        expect(result).toEqual(expected);
        result = nimnEncoder.decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 
    });
});