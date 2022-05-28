
const convert = {
    bin2dec : s => parseInt(s, 2).toString(10),
    bin2hex : s => parseInt(s, 2).toString(16),
    dec2bin : s => parseInt(s, 10).toString(2),
    dec2hex : s => parseInt(s, 10).toString(16),
    hex2bin : s => parseInt(s, 16).toString(2),
    hex2dec : s => parseInt(s, 16).toString(10)
};

console.log( parseInt("1337", 10).toString(2) );
console.log( convert.bin2dec('1000000') ); // '7'
//console.log( convert.dec2hex('42') );  // '2a'
//console.log( convert.hex2bin('f8') );  // '11111000'

console.log( convert.dec2bin('22') );  // '10110'
console.log( convert.dec2bin('97') );  // '1100001'

var ascii_char = "a".charCodeAt(0);
console.log(ascii_char);
console.log(typeof ascii_char);
console.log( parseInt("101", 2) );
//console.log(ascii_char & )

//if( byte > 127) there


function writeLength(len){
    var remainder = len % 128;
    //len = ( len - remainder ) / 128;
    len = ( len  / 128 ) >> 0;
    var byteArr = [];
    while( len > 127){
        byteArr.push(128);
        len -= 128;
    }
    if(len > 0) byteArr.push(len | 128);
    byteArr.push(remainder);
    return byteArr;
}

function readLength(index, byteArray){
    var a = 0,b = 0;
    for( ;index< byteArray.length; index++){
        if( byteArray[index] > 127 ){
            a += byteArray[index] - 128 || 128;
        }else{
            b= byteArray[index];
            break;
        }
    }
    return 128 * a + b;
}


console.log( writeLength(62) );
console.log( readLength(0, writeLength(62) ));
console.log( writeLength(162) );
console.log( readLength(0, writeLength(162) ));
console.log( writeLength(1337) );
console.log( readLength(0, writeLength(1337) ));
console.log( writeLength(16205) );
console.log( readLength(0, writeLength(16205) ));
console.log( writeLength(19205) );
console.log( readLength(0, writeLength(19205) ));
console.log( writeLength(19213) );
console.log( readLength(0, writeLength(19213) ));


var _FieldType = {
    ANY : 0,
    MAP : 1,
    LIST : 2,
    STRING : 3,
    NUMBER : 4,
    //DATE : 5,
    BOOLEAN : 6,
    ENUM : 7
}

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

function fieldIdValToBytes(value){//64 base
    var remainder = value % 64;
    value = ( value  / 64 ) >> 0;
    var byteArr = [];
    while( value > 63){
        byteArr.push(64);//mark 2nd MSB as 1
        value -= 64;
    }
    if(value > 0) byteArr.push( value | 64);//mark 2nd MSB as 1
    byteArr.push(remainder | 64);//mark 2nd MSB as 1
    return byteArr;
}

/* console.log( "field val", fieldIdValToBytes (5) );
console.log( "field val", fieldIdValToBytes (15) );
console.log( "field val", fieldIdValToBytes (25) );
console.log( "field val", fieldIdValToBytes (35) );
console.log( "field val", fieldIdValToBytes (55) );
console.log( "field val", fieldIdValToBytes (1355) );
console.log( "field val", fieldIdValToBytes (13555) ); */

//TODO: field value need not to be set
function fieldDetailToByteArr(fieldId, fieldType, fieldValue){
    var fieldIdRemainder = fieldId % 16;
    var fieldValBytes = fieldIdToBytes(fieldId);
    if(fieldType === _FieldType.MAP){
        var fieldValArr =  fieldIdValToBytes( fieldValue );
        fieldValBytes = fieldValBytes.concat( fieldValArr);
    }else if(fieldType === _FieldType.BOOLEAN){
        fieldType = fieldValue ? 4 : 3 ; 
    }else if(fieldType === _FieldType.NUMBER){
        fieldType = 0; 
        fieldValue = (fieldValue + '').length;
        
        var fieldValArr =  fieldIdValToBytes( fieldValue );
        fieldValBytes = fieldValBytes.concat( fieldValArr);

    }else if(fieldType === _FieldType.ENUM){
        if(fieldValue < 6) fieldType = 3 + fieldValue; // an enum's value can be embed in single byte
        else{//use next byte
            var fieldValArr =  fieldIdValToBytes( fieldValue );
            fieldValBytes = fieldValBytes.concat( fieldValArr);
        }
    }else if(fieldType !== _FieldType.LIST){
        fieldType 
    }
    
    fieldIdRemainder = (fieldIdRemainder << 3) | fieldType;
    
    if(fieldValBytes.length > 0) {
        for(var i=0;i< fieldValBytes.length -1; i++){//set MSB
            fieldValBytes[i] += 128;
        }
        return [fieldIdRemainder | 128 ].concat(fieldValBytes);
    }else{
        return [fieldIdRemainder ];
    }
}



function byteArrayToFieldDetail(index, byteArray){
    var fieldBytes = [];
    var fieldIdQuotient = 0;
    var fieldValueQuotient = 0;
    var fieldValueRemainder = 0;
    var fieldDetailByte = byteArray[index];
    if(fieldDetailByte > 127){
        index++;
        for( ; byteArray[index] > 127; index++){
            if(byteArray[index] < 192){//2nd bit is 0
                fieldIdQuotient += ( byteArray[index] - 128) || 64; //remoev 1 MSB, 0 means highest value 
            }else{//2nd digit it 1
                fieldValueQuotient += ( byteArray[index] - 192 ) || 64; //remove 2 MSB, 0 means highest value 
            }
            fieldBytes.push( byteArray[index] );
        }
        if(byteArray[index] < 64){//2nd bit is 0
            fieldIdQuotient += byteArray[index];
        }else{ //2nd digit it 1
            fieldValueRemainder = byteArray[index] - 64;
        }

        fieldDetailByte = fieldDetailByte - 128;
    }

    var fieldIdRemainder = fieldDetailByte >> 3 ;
    var fieldId = 16*fieldIdQuotient + fieldIdRemainder;
    var fieldValue = 64*fieldValueQuotient + fieldValueRemainder;
    var fieldType = fieldDetailByte & 7;//Keep 3 LSB

    
    
    console.log(fieldId, fieldValue, fieldType);
}

console.log( fieldDetailToByteArr (5, _FieldType.MAP, 6) );
byteArrayToFieldDetail( 0, fieldDetailToByteArr (5, _FieldType.MAP, 6) ) ;
console.log( fieldDetailToByteArr (15, _FieldType.MAP, 6) );
byteArrayToFieldDetail( 0, fieldDetailToByteArr (15, _FieldType.MAP, 6) ) ;
console.log( fieldDetailToByteArr (25, _FieldType.MAP, 6) );
byteArrayToFieldDetail( 0, fieldDetailToByteArr (25, _FieldType.MAP, 6) ) ;
console.log( fieldDetailToByteArr (35, _FieldType.MAP, 6) );
byteArrayToFieldDetail( 0, fieldDetailToByteArr (35, _FieldType.MAP, 6) );
console.log( fieldDetailToByteArr (135, _FieldType.MAP, 6) );
byteArrayToFieldDetail( 0, fieldDetailToByteArr (135, _FieldType.MAP, 6) );
console.log( fieldDetailToByteArr (3555, _FieldType.MAP, 6) );
byteArrayToFieldDetail( 0, fieldDetailToByteArr (3555, _FieldType.MAP, 6) );
console.log( fieldDetailToByteArr (13555, _FieldType.MAP, 6) );
byteArrayToFieldDetail( 0, fieldDetailToByteArr (13555, _FieldType.MAP, 6) );
console.log( fieldDetailToByteArr (13555, _FieldType.MAP, 1226) );
byteArrayToFieldDetail( 0, fieldDetailToByteArr (13555, _FieldType.MAP, 1226) );
console.log( fieldDetailToByteArr (13555, _FieldType.BOOLEAN, false) );//Read field type as value if given type is ENUM or BOOLEAN
byteArrayToFieldDetail( 0, fieldDetailToByteArr (13555, _FieldType.BOOLEAN, false) );//Read field type as value if given type is ENUM or BOOLEAN
console.log( fieldDetailToByteArr (13555, _FieldType.BOOLEAN, true) );//Read field type as value if given type is ENUM or BOOLEAN
byteArrayToFieldDetail( 0, fieldDetailToByteArr (13555, _FieldType.BOOLEAN, true) );//Read field type as value if given type is ENUM or BOOLEAN
console.log( fieldDetailToByteArr (13555, _FieldType.ENUM, 3) );//Read field type as value if given type is ENUM or BOOLEAN
byteArrayToFieldDetail( 0, fieldDetailToByteArr (13555, _FieldType.ENUM, 3) );//Read field type as value if given type is ENUM or BOOLEAN

console.log( fieldDetailToByteArr (13, _FieldType.BOOLEAN, false) );
byteArrayToFieldDetail( 0, fieldDetailToByteArr (13, _FieldType.BOOLEAN, false) );
console.log( fieldDetailToByteArr (13, _FieldType.BOOLEAN, true) );
byteArrayToFieldDetail( 0, fieldDetailToByteArr (13, _FieldType.BOOLEAN, true) );
console.log( fieldDetailToByteArr (13, _FieldType.ENUM, 3) );
byteArrayToFieldDetail( 0, fieldDetailToByteArr (13, _FieldType.ENUM, 3) );
console.log( fieldDetailToByteArr (13, _FieldType.ENUM, 8) );
byteArrayToFieldDetail( 0, fieldDetailToByteArr (13, _FieldType.ENUM, 8) );//ignore field type if field value presents



/* var buff = new Buffer([97,58,67,0,32,256]);
console.log(buff.length);
console.log(buff[3] === buff[5]);//true
console.log(buff.toString('utf8')); */