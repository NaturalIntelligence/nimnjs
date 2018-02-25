# nimnjs-node
JS implementation of nimn specification

[![Code Climate](https://codeclimate.com/github/nimndata/nimnjs-node//badges/gpa.svg)](https://codeclimate.com/github/nimndata/nimnjs-node/) 
[![Known Vulnerabilities](https://snyk.io/test/github/nimndata/nimnjs-node//badge.svg)](https://snyk.io/test/github/nimndata/nimnjs-node/) 
[![Travis ci Build Status](https://travis-ci.org/nimndata/nimnjs-node/.svg?branch=master)](https://travis-ci.org/nimndata/nimnjs-node/) 
[![Coverage Status](https://coveralls.io/repos/github/nimndata/nimnjs-node//badge.svg?branch=master)](https://coveralls.io/github/nimndata/nimnjs-node/?branch=master)


<img align="right" src="static/img/nimnjs-logo.png" /> 

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
