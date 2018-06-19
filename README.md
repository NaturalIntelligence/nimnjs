# nimnjs-node
JS implementation of nimn specification. Highly Compressed JS object/JSON. 60% or more compressed than JSON, 40% or more compressed than msgpack

[![Known Vulnerabilities](https://snyk.io/test/github/nimndata/nimnjs-node//badge.svg)](https://snyk.io/test/github/nimndata/nimnjs-node/) 
[![Travis ci Build Status](https://travis-ci.org/nimndata/nimnjs-node.svg?branch=master)](https://travis-ci.org/nimndata/nimnjs-node/) 
[![Coverage Status](https://coveralls.io/repos/github/nimndata/nimnjs-node/badge.svg?branch=master)](https://coveralls.io/github/nimndata/nimnjs-node/?branch=master)
[<img src="https://img.shields.io/badge/Try-me-blue.svg?colorA=FFA500&colorB=0000FF" alt="Try me"/>](https://nimndata.github.io/nimnjs-node/)
[![Twitter URL](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/nimnformat)

<a href="https://www.patreon.com/bePatron?u=9531404" data-patreon-widget-type="become-patron-button"><img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" alt="Become a Patron!" width="200" /></a>
<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KQJAX48SPUKNC"> <img src="https://www.paypalobjects.com/webstatic/en_US/btn/btn_donate_92x26.png" alt="Stubmatic donate button"/></a>

<img align="right" src="static/img/nimnjs-logo.png" /> 

## Introduction
NIMN JS can parse JS object to nimn data and vice versa. See Nimn [specification](https://github.com/nimndata/spec) for more detail.

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

Include [dist](dist/nimn.js) in your HTML to use it in browser.


Check the [demo](https://nimndata.github.io/nimnjs-node/) for instant use. It generates schema automatically with the help of [schema builder](https://github.com/nimndata/nimnjs-schema-builder) when sample json is provided.


## Support
Join the [official organization](https://github.com/nimndata) on github to support it. It can not only save bandwidth but speed up communication, search and much more.

## Users
List of applications and projects using Nimn. (Raise an issue to submit yours)

<a href="https://github.com/NaturalIntelligence/imglab" title="imglab" ><img src="https://github.com/NaturalIntelligence/imglab/blob/master/img/imglab_logo.png?raw=true" width="80px"  style="margin:4px;"></a> 
<a href="https://github.com/NaturalIntelligence/Stubmatic" title="stubmatic" ><img src="https://camo.githubusercontent.com/ff711425dc2286cd215637b7114eb43e571f001d/68747470733a2f2f6e61747572616c696e74656c6c6967656e63652e6769746875622e696f2f537475626d617469632f696d672f737475626d617469635f6c6f676f2e706e673f7261773d74727565" width="80px"  style="margin:4px;" ></a>
<a href="https://github.com/muneem4node/muneem" title="Muneem" ><img src="https://github.com/muneem4node/muneem/raw/master/static/muneem.png?raw=true" width="80px"  style="margin:4px;" ></a>
<a href="https://github.com/funcards/match-it/" title="Match it" ><img src="https://github.com/funcards/match-it/raw/master/static/img/matchit_logo.png?raw=true" width="80px"  style="margin:4px;" ></a>
<a href="https://github.com/NaturalIntelligence/fast-xml-parser" title="Fast XML Parser" ><img src="https://github.com/NaturalIntelligence/fast-xml-parser/raw/master/static/img/fxp_logo.png?raw=true" width="80px"  style="margin:4px;" ></a>

### Worth to mention

- **[imglab](https://github.com/NaturalIntelligence/imglab)** : Web based tool to label images for object. So that they can be used to train dlib or other object detectors. You can integrate 3rd party libraries for fast labeling.
- **[अनुमार्गक (anumargak)](https://github.com/NaturalIntelligence/anumargak)** : The fastest router for node web servers.

 - [Stubmatic](https://github.com/NaturalIntelligence/Stubmatic) : A stub server to mock behaviour of HTTP(s) / REST / SOAP services.
 - **[fastify-xml-body-parser](https://github.com/NaturalIntelligence/fastify-xml-body-parser/)** : Fastify plugin / module to parse XML payload / body into JS object using fast-xml-parser.
  - [fast-lorem-ipsum](https://github.com/amitguptagwl/fast-lorem-ipsum) : Generate lorem ipsum words, sentences, paragraph very quickly.
- [Grapes](https://github.com/amitguptagwl/grapes) : Flexible Regular expression engine which can be applied on char stream. (under development)
- [fast XML Parser](https://github.com/amitguptagwl/fast-xml-parser) : Fastest pure js XML parser for xml to js/json and vice versa. And XML validation.
