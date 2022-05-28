var mapType = require("./mapType");

function VarMapType(f_id, keyType, valueType){
    this._id = f_id;
    
    this._map = new MapType(id);
    map._keys = {
        key : keyType,
        value : valueType
    };
    this._fieldDetailBytes = Buffer.from( buildFieldDetailBytes(f_id, 2) );
}

VarMapType.prototype._encode = function (v){
    if(!v){
        return [];
    }else {
        var keys = Object.keys(v);
        if( keys.length === 0){
            return [];
        }else{
        var byteArray = [];
        var len = v.length;
        for(var i=0; i < keys.length; i++){    
            this._fieldDetailBytes
            this._map.encode( {
                key : keys[i],
                value : v[ keyName ]
            } )
            Buffer.from([this._fieldDetailBytes]), ... 
            
        }

        return byteArray;
    }
};

/* VarMapType.prototype._decode = function(v,i){
    if(v[i] === chars.emptyChar){
        return {index: i+1, value: {}};
    }else if(v[i] === chars.missingChar){
        return {index: i+1, value: undefined };
    }else if(v[i] === chars.nilChar){
        return {index: i+1, value: null }
    }else if(v[i] === chars.arrStart){
        i++;
        var currentObj = {};
        //get the index of first chars.fieldNameBoundaryChar after i
        var indexOfFieldSeparator = read(v,i);
        var fieldName = v.substring( i, indexOfFieldSeparator );
        i = indexOfFieldSeparator + 1;
        var str = this._item._decode( v,i );
        i = str.index;
        if(str.value !== undefined)
            currentObj[fieldName] = str.value;
        
        for( ; v[i] !== chars.arrEnd ;){
            var itemVal;
            if(v[i] === chars.boundaryChar){
                i++;
            }
            var indexOfFieldSeparator = read(v,i);
            var fieldName = v.substring( i, indexOfFieldSeparator );
            i = indexOfFieldSeparator + 1;
            itemVal = this._item._decode( v,i );
            i = itemVal.index;
            if(itemVal.value !== undefined)
                currentObj[fieldName] = itemVal.value;
        }

        return {
            index : i+1,
            value: currentObj
        }
    }else{
        throw Error("Invalid character at position " + i);
    }
}; */


module.exports = VarMapType;