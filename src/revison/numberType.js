const { buildFieldDetailBytes, intToLinkedBytes } = require("./common")
const FieldType = require("./fieldType");

function NumberType(f_id, defaultVal){
    this._id = f_id;
    //this._default = defaultVal;
    this.decimalSeparator = ".";//TODO: let's user configure it. https://en.wikipedia.org/wiki/Decimal_separator
    this._fieldDetailBytes_byte = Buffer.from( buildFieldDetailBytes(f_id, FieldType.BYTE) );
    this._fieldDetailBytes_linkedBytes = Buffer.from( buildFieldDetailBytes(f_id, FieldType.LINKED_BYTES) );

    this._fieldDetailBytes_metaField = Buffer.from( buildFieldDetailBytes(f_id, FieldType.HAS_META_FIELD) );
    this._fieldDetailBytes_metaField_No = Buffer.from( buildFieldDetailBytes(0, FieldType.NO) );
    this._fieldDetailBytes_metaField_Yes = Buffer.from( buildFieldDetailBytes(0, FieldType.YES) );
}

/**
 * 
 0 - 255     byte
 > 255       linked-data
 negative   2 field object
                     1st field : boolean
                     2nd field : linked-data
 float          2 field object
                     1st field : boolean
                     2nd field : array of linked data
 * @param {number} v 
 */
NumberType.prototype.encode = function(v){
    if( !v){//0, null, undefined, ''
        return [];
    }else if( typeof v !== 'number'){
        throw Error(`Mind your input. ${typeof v} is not expected for numeric field.`);
    }else{//negative
        let isNegative = false;
        if( v < 0){//negative
            isNegative = true;
            v = Math.abs(v);
        }

        if( isFloat(v) ){//float
            var numPair = (v + "").split(decimalSeparator);
            numPair[0] = intToLinkedBytes( parseInt(numPair[0]) );
            numPair[1] = intToLinkedBytes( parseInt(numPair[1]) );

            return [
                this._fieldDetailBytes_metaField ,
                isNegative ? this._fieldDetailBytes_metaField_Yes : this._fieldDetailBytes_metaField_No,
                numPair[0],
                numPair[1]
            ]
        }else{//integer

            if(isNegative){
                v = intToLinkedBytes(v);

                return [
                    this._fieldDetailBytes_metaField ,
                    this._fieldDetailBytes_metaField_Yes,
                    v
                ]
            }else{
                if( v < 256){//short
                    return [
                        this._fieldDetailBytes_byte ,
                        v
                    ]
                }else{
                    return [
                        this._fieldDetailBytes_linkedBytes ,
                        intToLinkedBytes(v)
                    ]
                }
            }
        }
        
    }

    var fieldLengthBytes = lengthToBytes(v.length);
    return [ this._fieldDetailBytes, fieldLengthBytes, Buffer.from(v)];
};

function isFloat(num){
    return !!(v % 1);
}
    /* 
NumberType.prototype._decode = function(v,i){
        if( inRange(v[i]) ){
            return {
                index: i+1,
                value: this._decodeChar[ v[i] ]
            }
        }else{
            var nextIndex = read(v,i);
            var val = v.substring(i,nextIndex);
            if(val.indexOf(".") === -1){
                val = Number.parseInt(val);
            }else{
                val = Number.parseFloat(val);
            }
            return { index: nextIndex, value: val};
        }
    };
 */
module.exports = NumberType;