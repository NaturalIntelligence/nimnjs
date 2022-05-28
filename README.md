# nimnjs-node
JS implementation of nimn specification. Highly Compressed JS object/JSON. 60% or more compressed than JSON, 40% or more compressed than msgpack

<a href="https://paypal.me/naturalintelligence"> <img src="static/img/support_paypal.svg" alt="Stubmatic donate button" width="200"/></a>


<img align="right" src="static/img/nimnjs-logo.png" /> 

## Introduction
NIMN JS can parse JS object to nimn data and vice versa. See Nimn [specification](https://github.com/NaturalIntelligence/nimn-spec) for more detail.

## Usages
First install or add to your npm package
```
$npm install nimnjs
```

```js
var nimn = require("nimnjs");

var objStructure = {
    type : "list",
    detail : {
        type : "map",
        detail : [{
            name : "name",
            type : "string"
        },{
            name : "age",
            type : "number"
        },{
            name : "isHuman",
            type : "boolean"
        },{
            name : "address",
            type : "string"
        },{
            name : "hobbies",
            type : "list",
            detail : {
                type : "string"
            }
        },{
            name : "project",
            type : "map",
            detail: [{
                name: "title",
                type : "string"
            },{
                name: "description",
                type : "string"
            },{
                name: "status",
                type : "string"
            }
            ]
        }
        ]
    }
}


var schema = nimn.buildSchema(objStructure);

var jData = [{
    "name" : "somename",
    "isHuman" : true,
    "age": 32,
    "address" : "I'll not tell you",
    hobbies : [ 
        null
        , "not reading "+ parser.chars.missingPremitive +" book"
        , "watching \\"+ parser.chars.nilPremitive +" movie"
    ],
    project : {
        title : "nimn",
        //description : "it is 80% smaller",
        status : "rocking"
    }
}]

var nimnDataString = nimn.stringify(schema, jData);
var result = nimn.parse(schema, nimnDataString);
expect(result).toEqual(jData); 
```

### Flexibility

* You can use old schema to parse nimn data created with old or new schema.
* You can use new schema to parse nimn data created with old or new schema.

Note that the fields must be added or deleted in the end of the map (object)

* Fields name can be chaged in the schema used for encoding and decoding. But their type and order must not be changed.

**Supported type**

* *map* : Fixed key value pairs
* *varmap* : Variable key value pairs where the values of any key have same structure
* *list* : list of similar values
* *boolean* : true / false
* *string* : Any valid string
* *number* : Any valid number

Include [dist](dist/nimn.js) in your HTML to use it in browser.


Check the [demo](https://amitkumargupta.work/nimn/) for instant use. It generates schema automatically with the help of [schema builder](https://github.com/NaturalIntelligence/nimnjs-schema-builder) when sample json is provided.


## Support
Join the [official organization](https://github.com/NaturalIntelligence) on github to support it. It can not only save bandwidth but speed up communication, search and much more.
