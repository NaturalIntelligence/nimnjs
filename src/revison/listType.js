const { buildFieldDetailBytes } = require("./common")

function ListType(id, item){
    this.id = id;
    this._item = item;
}

/**
 * Field detail byte for 2nd and further elements should have 0 field id
 * 
 * @param {any} v 
 */
ListType.prototype._encode = function (v){
    if(!v || v.length == 0){
        return [];
    }else {
        var byteArray = [];
        var len = v.length;
        for(var i=0; i < len; i++){
            byteArray.concat( this._item.encode( v[i] ) );
        }
        byteArray.concat( 0 ); //signify end of list
        return byteArray;
    }
};

/* ListType.prototype._decode = function(v,i){
    if(v[i] === chars.emptyChar){
        return {index: i+1, value: []};
    }else if(v[i] === chars.missingChar){
        return {index: i+1, value: undefined };
    }else if(v[i] === chars.nilChar){
        return {index: i+1, value: null }
    }else if(v[i] === chars.arrStart){
        i++;
        var currentArr = [];
        var str = this._item._decode( v,i );
        i = str.index;
        if(str.value !== undefined)
            currentArr.push(str.value);
        
        for( ; v[i] !== chars.arrEnd ;){
            var itemVal;
            if(v[i] === chars.boundaryChar){
                itemVal = this._item._decode( v,i +1 );
            }else{
                itemVal = this._item._decode( v,i );
            }
            i = itemVal.index;
            if(itemVal.value !== undefined)
                currentArr.push(itemVal.value);
        }

        return {
            index : i+1,
            value: currentArr
        }
    }else{
        throw Error("Invalid character at position " + i);
    }
}; */

module.exports = ListType;