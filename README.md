# nimnjs-node
JS implementation of nimn specification

## Introduction
See Nimn [specification](https://github.com/nimndata/spec) for more detail.

## Usages
First install or add to your npm package
```
$npm install nimn_schema_builder
```

```js
var nimn = require("nimnjs");

var schema = {
    "type": "object",
    "properties": {
        "name": {
            "type": "string"
        },
        "age": {
            "type": "number"
        },
        "male": {
            "type": "boolean"
        },
        "projects": {
            "type": "array",
            "properties": {
                "item": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string"
                        },
                        "decription": {
                            "type": "string"
                        }
                    }
                }
            }
        }
    }
}

var nimnObj = new nimn(schema);

var data = {
    "name" : "amit",
    "age" : 32,
    "male" : true,
    "projects" : [
        {
            "name": "some",
            "decription" : "some long description"
        }
    ]
}

var result = nimnObj.encode(data);//Æamitº32ÙÇÆsomeºsome long description
result = nimnObj.getDecoder().decode(result);
expect(result).toEqual(data); 
```
You can also use it in browser from [dist](dist/nimn.js) folder.


Check the [demo](https://nimndata.github.io/nimnjs-node/) for instant use. It generates schema automatically with the help of [schema builder](https://github.com/nimndata/nimnjs-schema-builder) when sample json is provided.
