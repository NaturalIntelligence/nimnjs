var dateParser = require("nimn-date-parser");
var nimn = require("../src/nimn");
var chars = require("../src/chars").chars;

describe("Nimn", function () {
    
    
    it("encodes and decodes date ", function () {
        var schema = {
            "name" : "string",
            "marks" : "number",
            "date" : "date"
        };
        var data = {
            "name" : "amit gupta",
            "marks" : 87.9,
            "date" : "Mon, 31 Aug 1970 02:03:04 +0300"
        };

        var nimnInstance = new nimn();
        nimnInstance.addSchema(schema);

        nimnInstance.addDataHandler("date",function(val){
            return dateParser.parse(val,true,true,true);
        },function(val){
                return "" + dateParser.parseBack(val,true,true,true);
        });

        var nimndata = nimnInstance.encode(data);
        //console.log(nimndata)
        var result = nimnInstance.decode(nimndata);
        //console.log(result)

    });
    it("encodes and decodes date ", function () {
        var schema = {
            "any_name": {
                "person": [
                    {
                        "phone": [
                            "number"
                        ],
                        "name": "string",
                        "age": "number",
                        "married": "string",
                        "birthday": "string",
                        "address": [
                            {
                                "city": "string",
                                "street": "string",
                                "buildingNo": "number",
                                "flatNo": "number"
                            }
                        ]
                    }
                ]
            }
        };
        var data = {
            "any_name": {
                "person": [
                    {
                        "phone": [
                            122233344550,
                            122233344551
                        ],
                        "name": "Jack",
                        "age": 33,
                        "married": "Yes",
                        "birthday": "Wed, 28 Mar 1979 12:13:14 +0300",
                        "address": [
                            {
                                "city": "New York",
                                "street": "Park Ave",
                                "buildingNo": 1,
                                "flatNo": 1
                            },
                            {
                                "city": "Boston",
                                "street": "Centre St",
                                "buildingNo": 33,
                                "flatNo": 24
                            }
                        ]
                    },
                    {
                        "phone": [
                            122233344553,
                            122233344554
                        ],
                        "name": "Boris",
                        "age": 34,
                        "married": "Yes",
                        "birthday": "Mon, 31 Aug 1970 02:03:04 +0300",
                        "address": [
                            {
                                "city": "Moscow",
                                "street": "Kahovka",
                                "buildingNo": 1,
                                "flatNo": 2
                            },
                            {
                                "city": "Tula",
                                "street": "Lenina",
                                "buildingNo": 3,
                                "flatNo": 78
                            }
                        ]
                    }
                ]
            }
        }

        var nimnInstance = new nimn();
        nimnInstance.addSchema(schema);

        nimnInstance.addDataHandler("date",function(val){
            return dateParser.parse(val,true,true,true);
        },function(val){
                return "" + dateParser.parseBack(val,true,true,true);
        });

        var nimndata = nimnInstance.encode(data);
        //console.log(nimndata)
        var result = nimnInstance.decode(nimndata);
        //console.log(result)

    });
});