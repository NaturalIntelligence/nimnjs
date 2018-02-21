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

array
1. str[item,item]
    > str|itemAitem
1a. MISSING[item,item]
    > !itemAitem
1b. MISSINGMISSING
    > !@
2. true[item,item]
    > YitemAitem
3. [true][item,item]
    > YitemAitem
4. {true}[item,item]
    > YitemAitem
5. [item][item,item]
    > item|itemAitem
5a. [item][true,true]
    > itemtrueAtrue
5b. [true][item,item]
    > trueitemAitem

6. [][item,item]
    > EitemAitem
7. {}[item,item]
    > EitemAitem

8. [{item},{}][item]
    > itemAE|item
9. str[]
    > strE
10. [][]str
    > EEstr


*/
describe("Nimn Encoder", function () {
    it("1. , 1a. , 1b. & 2 should append boundry char only if surronuding field can have dynamic data", function () {
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
                "str" : { type : "string"},
                "names2" : {
                    type: "array",
                    properties : {
                        "name" : { type : "string" }
                    }
                },
                "bool" : { type : "boolean"},
                "names3" : {
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
        var expected = "32" 
            + chars.boundryChar 
            + "amit" + chars.arraySepChar + "kumar"
            + chars.nilPremitive + chars.nilChar
            + chars.nilPremitive + chars.nilChar;

        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 


        var jData = {
            age : 32,
            names : ["amit", "kumar"],
            names2 : ["amit2", "kumar2"],
            bool: false
        }
        var expected = "32" 
            + chars.boundryChar 
            + "amit" + chars.arraySepChar + "kumar"
            + chars.nilPremitive
            + "amit2" + chars.arraySepChar + "kumar2"
            + chars.noChar + chars.nilChar;

        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 

        var jData = {
            //age : 32,
            //names : ["amit", "kumar"],
        }
        var expected = chars.emptyChar;
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
    });

    it("3., 4., 5., 5a., & 5b. should append boundry char only if two consecutive fields can have dynamic data", function () {
        var schema = {
            type : "object",
            properties : {
                "names" : {
                    type: "array",
                    properties : {
                        "name" : { type : "string" }
                    }
                },
                "names0" : {
                    type: "array",
                    properties : {
                        "name" : { type : "string" }
                    }
                },
                "names2" : {
                    type: "array",
                    properties : {
                        "name" : { type : "boolean" }
                    }
                },
                "names3" : {
                    type: "array",
                    properties : {
                        "name" : { type : "boolean" }
                    }
                },
                "names4" : {
                    type: "array",
                    properties : {
                        "obj": {
                            type : "object",
                            properties : {
                                "name" : { type : "string" }
                            }
                        }
                    }
                }
            }
        }

        var nimnEncoder = new nimn(schema);

        var jData = {
            names : ["true", "false"],
            names0 : ["true", "false"],
            names2 : [true, false],
            names3 : [true, false],
            names4 : [{ name: "somename"}]  ,
        }
        var expected = "true" + chars.arraySepChar + "false" 
            + chars.boundryChar + "true" + chars.arraySepChar + "false" 
            + chars.yesChar + chars.arraySepChar +  chars.noChar
            + chars.yesChar + chars.arraySepChar +  chars.noChar
            + "somename";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 

    });

    it(" 6., 7. should not append boundry char if surrounding field is empty array/object", function () {
        var schema = {
            type : "object",
            properties : {
                "names" : {
                    type: "array",
                    properties : {
                        "name" : { type : "string" }
                    }
                },
                "names1" : {
                    type: "array",
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
            names : [],
            names1 : [true, false],
            names2 : {}
        }
        var expected = chars.emptyChar 
            + chars.yesChar + chars.arraySepChar + chars.noChar
            + chars.emptyChar;
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
    });

    it("8. should not append boundry char when nearby field of surrounding array of object is app handle char", function () {
        var schema = {
            type : "object",
            properties : {
                "names" : {
                    type: "array",
                    properties : {
                        "obj": {
                            type : "object",
                            properties : {
                                "name" : { type : "string" }
                            }
                        }
                    }
                },
                "names1" : {
                    type: "array",
                    properties : {
                        "name" : { type : "string" }
                    }
                },
                "names2" : {
                    type: "array",
                    properties : {
                        "obj": {
                            type : "object",
                            properties : {
                                "name" : { type : "string" }
                            }
                        }
                    }
                }
                
            }
        }

        var nimnEncoder = new nimn(schema);

        var jData = {
            names : [{ name : "someone"}, {}],
            names1 : ["somename2","somename4"],
            names2 : [{}, { name : "someone3"}],
        }
        var expected = "someone" + chars.arraySepChar + chars.emptyChar
        + "somename2" + chars.arraySepChar + "somename4"
        + chars.emptyChar + chars.arraySepChar  + "someone3";
        
        var result = nimnEncoder.encode(jData);
        //console.log(chars);
        //console.log(result);
        expect(result).toEqual(expected); 
    });

    it(" 9., 10. should not append boundry char if surrounding field can have dynamic value while the array itself is empty", function () {
        var schema = {
            type : "object",
            properties : {
                "name" : { type : "string" },
                "names1" : {
                    type: "array",
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
            name : "amit",
            names1 : [],
            names2 : {}
        }
        var expected = "amit" + chars.emptyChar + chars.emptyChar;
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
    });
});