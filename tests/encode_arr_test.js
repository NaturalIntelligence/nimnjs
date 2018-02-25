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
        var expected = chars.objStart
            + "32" 
            + chars.arrStart 
            + "amit" + chars.arraySepChar + "kumar"
            + chars.missingPremitive + chars.missingChar
            + chars.missingPremitive + chars.missingChar;

        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
        //console.log(result);
        result = nimnEncoder.getDecoder().decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 

         var jData = {
            age : 32,
            names : ["amit", "kumar"],
            names2 : ["amit2", "kumar2"],
            bool: false
        }
        var expected = chars.objStart + "32" 
            + chars.arrStart  
            + "amit" + chars.arraySepChar + "kumar"
            + chars.missingPremitive
            + chars.arrStart 
            + "amit2" + chars.arraySepChar + "kumar2"
            + chars.noChar + chars.missingChar;

        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
        result = nimnEncoder.getDecoder().decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 

        var jData = {
            //age : 32,
            //names : ["amit", "kumar"],
        }
        var expected = chars.emptyChar;
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
        result = nimnEncoder.getDecoder().decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData);   
    }); 

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
            names2 : [""]
        }
        var expected = chars.objStart + "32" 
            + chars.arrStart 
            + "amit" + chars.arraySepChar + "kumar"
            + chars.missingPremitive 
            + chars.arrStart + chars.emptyValue
            + chars.missingChar;

        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
        //console.log(result);
        result = nimnEncoder.getDecoder().decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 
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
        var expected = chars.objStart + chars.arrStart  + "true" + chars.arraySepChar + "false" 
            + chars.arrStart  + "true" + chars.arraySepChar + "false" 
            + chars.arrStart + chars.yesChar + chars.arraySepChar +  chars.noChar
            + chars.arrStart  + chars.yesChar + chars.arraySepChar +  chars.noChar
            + chars.arrStart + chars.objStart + "somename";
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
        result = nimnEncoder.getDecoder().decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 

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
        var expected =  chars.objStart + chars.emptyChar 
            + chars.arrStart  + chars.yesChar + chars.arraySepChar + chars.noChar
            + chars.emptyChar;
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
        result = nimnEncoder.getDecoder().decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 
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
        var expected = chars.objStart + chars.arrStart + chars.objStart + "someone" + chars.arraySepChar + chars.emptyChar
        + chars.arrStart + "somename2" + chars.arraySepChar + "somename4"
        + chars.arrStart + chars.emptyChar + chars.arraySepChar  + chars.objStart + "someone3";
        
        var result = nimnEncoder.encode(jData);
        //console.log(chars);
        //console.log(result);
        expect(result).toEqual(expected); 
        result = nimnEncoder.getDecoder().decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 
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
        var expected = chars.objStart + "amit" + chars.emptyChar + chars.emptyChar;
        var result = nimnEncoder.encode(jData);
        expect(result).toEqual(expected); 
        result = nimnEncoder.getDecoder().decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(jData); 
    }); 

    it(" custom", function () {
        var schema = {
            "type" : "object",
            "properties" : {
                "persons" : {
                    "type" : "array",
                        "properties" : {
                            "person" : {
                                "type" : "object",
                                "properties" : {
                                    "name" : { "type" : "string" },
                                    "age" : { "type" : "number" },
                                    "registered" : { "type" : "boolean" },
                                    "calldetails" : {
                                        "type": "array",
                                        "properties" : {
                                            "calldetail" : {
                                                "type": "object",
                                                "properties" : {
                                                    "from" : { "type" : "string" },
                                                    "to" : { "type" : "string" },
                                                    "when" : { "type" : "date" }
                                                }
                                            }
                                        }
                                    }
                                }
                        }
                    }
                }
            }
        };

        var nimnEncoder = new nimn(schema);

        var data = { 
            persons : [
                {
                    "name" : "somename",
                    "age": 30,
                    "registered" : true,
                    "calldetails" : [
                        {
                            "from" : "123456789",
                            "to" : "123456789",
                            "when" : "2018-02-23T10:12:30.041Z"
                        },
                        {
                            "from" : "123456789",
                            "to" : "123456789",
                            "when" : "2018-02-23T10:12:30.041Z"
                        }
                    ]
                }
            ]
        };

        var expected = chars.objStart + chars.arrStart + chars.objStart
        + "somename" + chars.boundryChar + "30" + chars.yesChar
        + chars.arrStart + chars.objStart
        + "123456789" + chars.boundryChar + "123456789" + chars.boundryChar + "2018-02-23T10:12:30.041Z"
        + chars.arraySepChar + chars.objStart
        + "123456789" + chars.boundryChar + "123456789" + chars.boundryChar + "2018-02-23T10:12:30.041Z"
        ;
        var result = nimnEncoder.encode(data);
        //console.log(result);
        expect(result).toEqual(expected); 
        result = nimnEncoder.getDecoder().decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(data); 

    });  

    it(" only array", function () {
        var schema = {
            "type" : "array",
            "properties" : {
                "person" : {
                    "type" : "object",
                    "properties" : {
                        "name" : { "type" : "string" },
                        "age" : { "type" : "number" },
                        "registered" : { "type" : "boolean" },
                        "calldetails" : {
                            "type": "array",
                            "properties" : {
                                "calldetail" : {
                                    "type": "object",
                                    "properties" : {
                                        "from" : { "type" : "string" },
                                        "to" : { "type" : "string" },
                                        "when" : { "type" : "date" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };

        var nimnEncoder = new nimn(schema);

        var data = [
                {
                    "name" : "somename",
                    "age": 30,
                    "registered" : true,
                    "calldetails" : [
                        {
                            "from" : "123456789",
                            "to" : "123456789",
                            "when" : "2018-02-23T10:12:30.041Z"
                        },
                        {
                            "from" : "123456789",
                            "to" : "123456789",
                            "when" : "2018-02-23T10:12:30.041Z"
                        }
                    ]
                }
            ];

        var expected = chars.arrStart + chars.objStart
        + "somename" + chars.boundryChar + "30" + chars.yesChar
        + chars.arrStart + chars.objStart
        + "123456789" + chars.boundryChar + "123456789" + chars.boundryChar + "2018-02-23T10:12:30.041Z"
        + chars.arraySepChar + chars.objStart
        + "123456789" + chars.boundryChar + "123456789" + chars.boundryChar + "2018-02-23T10:12:30.041Z"
        ;
        var result = nimnEncoder.encode(data);
        //console.log(result);
        expect(result).toEqual(expected); 
        result = nimnEncoder.getDecoder().decode(result);
        //console.log(JSON.stringify(result));
        expect(result).toEqual(data); 

    }); 
});