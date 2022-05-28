var Benchmark = require('benchmark');
var suite = new Benchmark.Suite("JS features");


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
  //if(len > 0) byteArr.push(len + 128);
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




function writeLength2(len){
  var remainder = len % 128;
  //len = ( len - remainder ) / 128;
  len = ( len  / 128 ) >> 0;
  var byteArr = [];
  while( len > 127){
      byteArr.push(1);
      len -= 128;
  }
  if(len > 0) byteArr.push( (len << 1) | 1);
  byteArr.push(remainder << 1);
  return byteArr;
}

function readLength2(index, byteArray){
  var a = 0,b = 0;
  for( ;index< byteArray.length; index++){
      if( byteArray[index] & 1 ){
          var byteData = byteArray[index] >> 1 || 128;
          a += byteData;
      }else{
          b= byteArray[index] >> 1;
          break;
      }
  }
  return 128 * a + b;
}

suite
.add('LSB', function() {
  readLength2(0, writeLength2(62) );
  readLength2(0, writeLength2(162) );
  readLength2(0, writeLength2(1337) );
  readLength2(0, writeLength2(16205) );
  readLength2(0, writeLength2(19205) );
  readLength2(0, writeLength2(19213) );
})
.add('MSB', function() {
  readLength(0, writeLength(62) );
  readLength(0, writeLength(162) );
  readLength(0, writeLength(1337) );
  readLength(0, writeLength(16205) );
  readLength(0, writeLength(19205) );
  readLength(0, writeLength(19213) );
})

.on('start',function(){
	console.log("Running Suite: " + this.name);
})
.on('error',function(e){
	console.log("Error in Suite: ",e);
})
.on('abort',function(e){
	console.log("Aborting Suite: " + this.name);
})
.on('complete', function() {
  for (var j = 0; j < this.length; j++) {
    console.log(this[j].name + " : " +   this[j].hz + " requests/second");
  }
})
.run({ 'async': true });