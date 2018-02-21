var nimn = require("../src/nimn");
var chars = require("../src/chars").chars;


/*
A: arraySepChar
E: emptyChar
|: boundryChar
Y: true
N: false
!: nil, missing
@: object or array nil/missing


1. str{item}
    > str|item
1a. MISSING{item}
    > !item
1b. MISSINGMISSING
    > !@
2. true{item}
    > Yitem
3. {true}{item}
    > Yitem
3a. {item}{item}
    > item|item
3a. {true}{true}
    > YY

4. {{}}str
    > Estr

*/

describe("Nimn Encoder", function () {

    it(" 1., 1a., 1b.  should not append boundry char if conseucative fields can have dynamic value", function () {
        var schema = {
            type : "object",
            properties : {
                "name" : { type : "string" },
                "names1" : {
                    type: "object",
                    properties : {
                        "name" : { type : "string" }
                    }
                }
            }
        }

        var nimnEncoder = new nimn(schema);

        var jData = {
            name : "amit",
            names1 : { name: "amit"}
        }
        var expected = "amit" + chars.boundryChar + "amit";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 

        var jData = {
            names1 : { name: "amit"}
        }
        var expected =  chars.nilPremitive + "amit";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 

        var jData = {
            name : "amit",
            names1 : {}
        }
        var expected =  "amit" + chars.emptyChar;
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 

        var jData = {
            name : "amit",
        }
        var expected =  "amit" + chars.nilChar;
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 

    });

    it(" 3. ", function () {
        var schema = {
            type : "object",
            properties : {
                "names1" : {
                    type: "object",
                    properties : {
                        "name" : { type : "boolean" }
                    }
                },
                "names2" : {
                    type: "object",
                    properties : {
                        "name" : { type : "string" }
                    }
                }
            }
        }

        var nimnEncoder = new nimn(schema);

        var jData = {
            names1 : { name: true},
            names2 : { name: "amit"}
        }
        var expected = chars.yesChar + "amit";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 

        var jData = {
            names2 : { name: "amit"}
        }
        var expected =  chars.nilChar + "amit";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 

        var jData = {
            names1 : { name: true},
            names2 : {}
        }
        var expected =  chars.yesChar + chars.emptyChar;
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 

        var jData = {
            names1 : { name: true},
        }
        var expected =  chars.yesChar + chars.nilChar;
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 

    });

    it(" 2. for boolean value;  should not append boundry char if conseucative fields can have dynamic value", function () {
        var schema = {
            type : "object",
            properties : {
                "name" : { type : "boolean" },
                "names1" : {
                    type: "object",
                    properties : {
                        "name" : { type : "string" }
                    }
                }
            }
        }

        var nimnEncoder = new nimn(schema);

        var jData = {
            name : true,
            names1 : { name: "amit"}
        }
        var expected = chars.yesChar + "amit";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 

        var jData = {
            names1 : { name: "amit"}
        }
        var expected =  chars.nilPremitive + "amit";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 

        var jData = {
            name : true,
            names1 : {}
        }
        var expected =  chars.yesChar + chars.emptyChar;
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 

        var jData = {
            name : "amit",
        }
        var expected =  chars.yesChar + chars.nilChar;
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 

    });

    it(" 3b. ", function () {
        var schema = {
            type : "object",
            properties : {
                "names1" : {
                    type: "object",
                    properties : {
                        "name" : { type : "string" }
                    }
                },
                "names2" : {
                    type: "object",
                    properties : {
                        "name" : { type : "string" }
                    }
                }
            }
        }

        var nimnEncoder = new nimn(schema);

        var jData = {
            names1 : { name: "amit"},
            names2 : { name: "amit"}
        }
        var expected =  "amit" + chars.boundryChar+ "amit";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 

        var jData = {
            names2 : { name: "amit"}
        }
        var expected =  chars.nilChar + "amit";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 

        var jData = {
            names1 : { name: "amit"},
            names2 : {}
        }
        var expected =  "amit" + chars.emptyChar;
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 

    });

    it(" 4.", function () {
        var schema = {
            type : "object",
            properties : {
                "names1" : {
                    type: "object",
                    properties : {
                        "obj" : {
                            type : "object",
                            properties : {
                                "name" : { type : "string" }
                            }
                        }
                    }
                },
                "name" : { type : "string" },
                
            }
        }

        var nimnEncoder = new nimn(schema);

        var jData = {
            names1 : { "obj" : {name: "amit"}},
            name : "amit",
        }
        var expected = "amit" + chars.boundryChar + "amit";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 

        var jData = {
            names1 : { "obj" : {}},
            name : "amit",
        }
        var expected =  chars.emptyChar + "amit";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 

        var jData = {
            names1 : {},
            name : "amit",
        }
        var expected =  chars.emptyChar + "amit";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 

        var jData = {
            name : "amit",
        }
        var expected =  chars.nilChar + "amit";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 

    });
    
});