const BooleanType = require("./booleanType");
const StringType = require("./stringType");
const NumberType = require("./numberType");
const MapType = require("./mapType");
const ListType = require("./listType");

function DefBuilder(){
    this.container = {};
    this.pending = {};
    this.typeHandlers = {
        "boolean" : function(id, repeated){
            return new BooleanType(id, repeated);
        },
        "string" : function(id){
            return new StringType(id);
        },
        "number" : function(id){
            return new NumberType(id);
        },
        "list" : function(id, keyType){
            return new ListType(id, keyType);
        },
        "map" : function(id, keyType, valueType){
            return new MapType(id, keyType, valueType);
        }
    };
}

/**
 * If a data type is not found then put it in pending instructions
 * @param {string} componentName 
 * @param {object} fieldDetail 
 */
DefBuilder.prototype.add = function(componentName, fieldDetail){
    componentName = componentName.toLowerCase();

    if( !this.container[ componentName ] ){
        this.container[ componentName ] = {};
    }

    var success = this.buildDefinition(componentName, fieldDetail);
    if( !success ){
        this.processItLater( componentName ,fieldDetail);
    }
}


DefBuilder.prototype.buildDefinition = function(componentName, fieldDetail){
    let keyTypeHandler, valueTypeHandler;
    if( fieldDetail.keyType ){
        let typeHandler = this.typeHandlers [ fieldDetail.keyType ];
        if(  typeHandler ){
            keyTypeHandler = typeHandler(fieldDetail.id, fieldDetail.keyType === "boolean");
        }else{ //process later
            this.processItLater( componentName ,fieldDetail);
            return;
        }
    }

    if( fieldDetail.valueType ){
        let typeHandler = this.typeHandlers [ fieldDetail.valueType ];
        if(  typeHandler ){
            valueTypeHandler = typeHandler(fieldDetail.id);
        }else{ //process later
            this.processItLater( componentName ,fieldDetail);
            return;
        }
    }

    let typeHandler = this.typeHandlers [ fieldDetail.type ];
    if(  typeHandler ){
        this.container[ componentName ][ fieldDetail.name ] = typeHandler(fieldDetail.id, keyTypeHandler, valueTypeHandler);
        return true;
    }else{ //process later
        return;
    }
}

DefBuilder.prototype.processItLater = function(componentName, fieldDetail){
    if( !this.pending[ componentName ] ){
        this.pending[ componentName ] = [];
    }

    this.pending[ componentName ].push(fieldDetail);
}

DefBuilder.prototype.finish = function(componentName){
    
    if(componentName){
        componentName = componentName.toLowerCase();
        if( this.pending[ componentName ] ){
            //Do nothing
        }else { //copy to type handler
            const container = this.container;
            this.typeHandlers [ componentName ] = function(id){
                const map = new MapType(id);
                map._keys = container[ componentName ];
                return map;
            }
        }
    }else{//process all pending definitions
        this.processPending();
    }
}

DefBuilder.prototype.processPending = function(){

    const pendingComponents = Object.keys(this.pending);

    for(let c_i =0; c_i <  pendingComponents.length; c_i++){
        let componentName = pendingComponents[ c_i ];
        let fieldDetails = this.pending [ componentName ];
        let fieldsLength = fieldDetails.length;
        while(fieldsLength--){
            let fieldDetail = fieldDetails[ fieldsLength - 1 ];
            
            const success = this.buildDefinition(componentName, fieldDetail);
            if(  success ){//if relevant type handler is present then delete the instruction
                fieldDetails.splice(fieldsLength, 1);
            }
        }

        //if all the fields of a component are added then delete from pending and add to type handler
        if(fieldDetails.length == 0){
            const container = this.container;
            this.typeHandlers [ componentName ] = function(id){
                const map = new MapType(id);
                map._keys = container[ componentName ];
                return map;
            }
            delete this.pending [ componentName ];
        }

    }

    if(this.pending.length > 0){
        this.processPending();
    }

}

module.exports = DefBuilder;