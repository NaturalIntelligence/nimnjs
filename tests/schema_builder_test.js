var nimn = require("../src/nimn");

describe("Nimn Schema Builder", function () {
    it("should build schema for valid object", function () {
        var data = {
            name : "amit",
            age : 32,
            male : true,
            projects : [
                {
                    name: "some",
                    from: new Date(),
                    //to: null,
                    decription : "some long description"
                }
            ]
        }
    });

    it("should build schema for valid array", function () {
        var data = ["amit", "kymar", "gupta"];
    });

    it("should build schema for valid premitive type", function () {
    });

    it("should not build schema for valid object aving unsupported data type null/symbol/undefined/function", function () {

    });
});