const { buildFieldDetailBytes } = require("./common")

function MapType(f_id){
    this._id = f_id;
    this._fieldDetailBytes = Buffer.from([]);
    if(f_id){//root level element will not have id
        this._fieldDetailBytes = Buffer.from( buildFieldDetailBytes(f_id, 3) );
    }
}

MapType.prototype.encode = function(v){
    
    if(!v){
        return [];
    }else {
        var keys = Object.keys(v);
        if( keys.length === 0){
            return [];
        }else{
            var fieldLengthBytes = lengthToBytes(keys.length);
            var byteArray = [ this._fieldDetailBytes, fieldLengthBytes ];

            for(var i=0; i < keys.length; i++){    
                var keyName = keys[i];
                byteArray.concat( this._keys[ keyName ].encode( v[keyName] ) );
            }

            return byteArray;
        }
    }
};

/* MapType.prototype._decode = function(v,i){
    if(v[i] === chars.emptyChar){
        return {index: i+1, value: {} };
    }else if(v[i] === chars.missingChar){
        return {index: i+1, value: undefined };
    }else if(v[i] === chars.nilChar){
        return {index: i+1, value: null }
    }else if(v[i] === chars.objStart){
        i++;
        var currentObj = {};
        var str = this._keys[0]._decode( v,i );
        i = str.index;
        if(str.value !== undefined){
            currentObj[ this._keys[ 0 ]._name ] = str.value;
        }
        for(var key_i=1; key_i < this._len && v[i] !== chars.objEnd; key_i++){
            var keyVal ;
            if(v[i] === chars.boundaryChar){
                keyVal = this._keys[ key_i ]._decode( v,i +1 );
            }else{
                keyVal = this._keys[ key_i ]._decode( v,i );
            }
            i = keyVal.index;
            if(keyVal.value !== undefined){
                currentObj[ this._keys[ key_i ]._name ] = keyVal.value;
            }
        }
        if(v[i] !== chars.objEnd){
            i = skipUntilThisObjectEnds(v, i);
        }
        return {
            index : i+1,
            value: currentObj
        }
    }else{
        throw Error("Invalid character at position " + i);
    }
};
 */


module.exports = MapType;