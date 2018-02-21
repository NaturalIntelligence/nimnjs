var nimn = require("../src/nimn");
var chars = require("../src/chars");


/*
A: arraySepChar
E: emptyChar
|: boundryChar
Y: true
N: false
!: nil, missing

array
1. str[item,item]
    > str|itemAitem
1a. MISSING[item,item]
    > !itemAitem
2. true[item,item]
    > YitemAitem
3. [true][item,item]
    > YitemAitem
4. {true}[item,item]
    > YitemAitem
5. [item][item,item]
    > item|itemAitem

6. [][item,item]
    > EitemAitem
7. {}[item,item]
    > EitemAitem

8. [{item},{}][item]
    > itemAE|item
9. [item,item][item]
    > itemAitem|item
10. [item,item][true]
    > itemAitemY
11. str[]
    > strE
12. [][]str
    > EEstr


*/
describe("Nimn Encoder", function () {
    it("1. & 1a. should append boundry char if last field can have dynamic data", function () {
        var schema = {
            type : "object",
            properties : {
                "age" : { type : "number"},
                "names" : {
                    type: "array",
                    properties : {
                        "name" : { type : "string" }
                    }
                },
               /*  "str" : { type : "string"},
                "names" : {
                    type: "array",
                    properties : {
                        "name" : { type : "string" }
                    }
                },
                "bool" : { type : "boolean"},
                "names" : {
                    type: "array",
                    properties : {
                        "name" : { type : "string" }
                    }
                } */
            }
        }

        var nimnEncoder = new nimn(schema);

        var jData = {
            age : 32,
            names : ["amit", "kumar"]
        }
        var expected = "32" + chars.boundryChar + "amit" + chars.arraySepChar + "kumar";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 

        var jData = {
            //age : 32,
            names : ["amit", "kumar"],
        }
        var expected = chars.nilPremitive + "amit" + chars.arraySepChar + "kumar";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
    });

    it("1. & 1a. should append boundry char if last field can have dynamic data", function () {
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
            names : ["amit", "kumar"],
        }
        var expected = "32" + chars.boundryChar + "amit" + chars.arraySepChar + "kumar";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 

        var jData = {
            //age : 32,
            names : ["amit", "kumar"],
        }
        var expected = chars.nilPremitive + "amit" + chars.arraySepChar + "kumar";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
    });

    it("should not append boundry char if last field is empty array", function () {
        var schema = {
            type : "object",
            properties : {
                "names" : {
                    type: "array",
                    properties : {
                        "name" : { type : "string" }
                    }
                },
                "age" : { type : "number"}
            }
        }

        var nimnEncoder = new nimn(schema);

        var jData = {
            names : [],
            age : 32
        }
        var expected = chars.emptyChar + "32";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
    });

    it("should not append boundry char or arraySepChar if last field is an empty object", function () {
        var schema = {
            type : "object",
            properties : {
                "obj" : {
                    type : "object",
                    properties : {
                        "age" : { type : "number"}
                    }
                },
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
            obj: {age : 32},
            names : ["somename"],
        }
        //var expected = "32" + chars.arraySepChar + "somename";
        var expected = "32" + chars.boundryChar  + "somename";

        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 


        var jData = {
            obj: {},
            names : ["somename"],
        }
        var expected = chars.emptyChar + "somename";

        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
    });
});