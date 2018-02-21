var nimn = require("../src/nimn");
var chars = require("../src/chars");


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
5. {}{}str
    > EEstr

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
    });
});