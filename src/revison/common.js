/**
 * Convert Integer to 128 base byte array 
 * where 1st byte denotes remainder and other bytes denotes quotient
 * @param {number} num 
 */
function intToLinkedBytes(num){
    return num;//TODO: implement it
}


/**
 * Field Id starts from 0.
 * 4 bytes after MSB are used to keep (base 16) field id value from 0 - 15.
 * if the field id value is greater than 15 then next byte is used.
 * Extended bytes keep quotient.
 * @param {number} id 
 */
function fieldIdToBytes(id){
    //var remainder = id % 16;
    id = ( id  / 16 ) >> 0;
    var byteArr = [];
    while( id > 63){
        byteArr.push(0);//2nd MSB should be 0
        id -= 64;
    }
    if(id > 0) byteArr.push( id);//2nd MSB should be 0
    return byteArr;
}

const buildFieldDetailBytes = function(f_id,f_type){
    var fieldIdRemainder = f_id % 16;
    fieldIdRemainder = (fieldIdRemainder << 3) | f_type;
    var fieldValBytes = fieldIdToBytes(f_id);

    if(fieldValBytes.length > 0) {
        for(var i=0;i< fieldValBytes.length -1; i++){//set MSB to 1
            fieldValBytes[i] += 128;
        }
        return  [fieldIdRemainder | 128 ].concat(fieldValBytes) ;//MSB for last byte should be 0
    }else{
        return  [fieldIdRemainder ] ;
    }

}

module.exports = {
    buildFieldDetailBytes : buildFieldDetailBytes,
    intToLinkedBytes : intToLinkedBytes
}