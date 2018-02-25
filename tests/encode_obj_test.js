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
        var expected = chars.objStart + "amit" + chars.objStart + "amit";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
        result = nimnEncoder.getDecoder().decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 

        var jData = {
            names1 : { name: "amit"}
        }
        var expected =  chars.objStart + chars.missingPremitive + chars.objStart + "amit";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
        result = nimnEncoder.getDecoder().decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 

        var jData = {
            name : "amit",
            names1 : {}
        }
        var expected =  chars.objStart + "amit" + chars.emptyChar;
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected);
        result = nimnEncoder.getDecoder().decode(result);
        expect(result).toEqual(jData);  

        var jData = {
            name : "amit",
        }
        var expected =  chars.objStart + "amit" + chars.missingChar;
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
        result = nimnEncoder.getDecoder().decode(result);
        expect(result).toEqual(jData);  

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
        var expected = chars.objStart  + chars.objStart  
        + chars.yesChar + chars.objStart   + "amit";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
        result = nimnEncoder.getDecoder().decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 

        var jData = {
            names2 : { name: "amit"}
        }
        var expected =  chars.objStart + chars.missingChar + chars.objStart + "amit";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
        result = nimnEncoder.getDecoder().decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 

        var jData = {
            names1 : { name: true},
            names2 : {}
        }
        var expected = chars.objStart + chars.objStart + chars.yesChar + chars.emptyChar;
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
        result = nimnEncoder.getDecoder().decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 

        var jData = {
            names1 : { name: true},
        }
        var expected =  chars.objStart + chars.objStart + chars.yesChar + chars.missingChar;
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
        result = nimnEncoder.getDecoder().decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 

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
        var expected = chars.objStart + chars.yesChar + chars.objStart + "amit";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
        result = nimnEncoder.getDecoder().decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 

        var jData = {
            names1 : { name: "amit"}
        }
        var expected =  chars.objStart + chars.missingPremitive + chars.objStart + "amit";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
        result = nimnEncoder.getDecoder().decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 

        var jData = {
            name : true,
            names1 : {}
        }
        var expected =  chars.objStart  + chars.yesChar + chars.emptyChar;
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
        result = nimnEncoder.getDecoder().decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 

        var jData = {
            name : true,
        }
        var expected =  chars.objStart + chars.yesChar + chars.missingChar;
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
        result = nimnEncoder.getDecoder().decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 

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
        var expected =  chars.objStart + chars.objStart +"amit" + chars.objStart + "amit";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
        result = nimnEncoder.getDecoder().decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 

        var jData = {
            names2 : { name: "amit"}
        }
        var expected =  chars.objStart + chars.missingChar + chars.objStart +"amit";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
        result = nimnEncoder.getDecoder().decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 

        var jData = {
            names1 : { name: "amit"},
            names2 : {}
        }
        var expected =  chars.objStart + chars.objStart + "amit" + chars.emptyChar;
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
        result = nimnEncoder.getDecoder().decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 

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
        var expected = chars.objStart + chars.objStart + chars.objStart + "amit" + chars.boundryChar + "amit";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
        result = nimnEncoder.getDecoder().decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 


        var jData = {
            names1 : { "obj" : {}},
            name : "amit",
        }
        var expected =  chars.objStart + chars.objStart + chars.emptyChar + "amit";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
        result = nimnEncoder.getDecoder().decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData);

        var jData = {
            names1 : {},
            name : "amit",
        }
        var expected =  chars.objStart + chars.emptyChar + "amit";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected);
        result = nimnEncoder.getDecoder().decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData);  

        var jData = {
            name : "amit",
        }
        var expected =  chars.objStart + chars.missingChar + "amit";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
        result = nimnEncoder.getDecoder().decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 

    });
    
});