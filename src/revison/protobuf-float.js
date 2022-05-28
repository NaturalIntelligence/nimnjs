const assert = require('assert');
//var buf = new Uint8Array(4);
var buf = [];
var split64High, split64Low;

BinaryConstants = {
    FLOAT32_MIN : 1.1754943508222875e-38,
    FLOAT32_MAX : 3.4028234663852886e+38,
    TWO_TO_23 : 8388608
}


var splitFloat32 = function(value) {
  var sign = (value < 0) ? 1 : 0;
  value = sign ? -value : value;
  var exp;
  var mant;

  // Handle zeros.
  if (value === 0) {
    if ((1 / value) > 0) {
      // Positive zero.
      split64High = 0;
      split64Low = 0x00000000;
    } else {
      // Negative zero.
      split64High = 0;
      split64Low = 0x80000000;
    }
    return;
  }

  // Handle nans.
  if (isNaN(value)) {
    split64High = 0;
    split64Low = 0x7FFFFFFF;
    return;
  }

  // Handle infinities.
  if (value > BinaryConstants.FLOAT32_MAX) {
    split64High = 0;
    split64Low = ((sign << 31) | (0x7F800000)) >>> 0;
    return;
  }

  // Handle denormals.
  if (value < BinaryConstants.FLOAT32_MIN) {
    // Number is a denormal.
    mant = Math.round(value / Math.pow(2, -149));
    split64High = 0;
    split64Low = ((sign << 31) | mant) >>> 0;
    return;
  }

  exp = Math.floor(Math.log(value) / Math.LN2);
  mant = value * Math.pow(2, -exp);
  mant = Math.round(mant * BinaryConstants.TWO_TO_23) & 0x7FFFFF;

  split64High = 0;
  split64Low = ((sign << 31) | ((exp + 127) << 23) | mant) >>> 0;
};

var writeUint32 = function(value) {
  console.log(value)
  assert(value == Math.floor(value));
  assert((value >= 0) && (value < BinaryConstants.TWO_TO_32));
  buf.push((value >>> 0) & 0xFF);
  buf.push((value >>> 8) & 0xFF);
  buf.push((value >>> 16) & 0xFF);
  buf.push((value >>> 24) & 0xFF);
};

var writeFloat = function(value) {
    assert((value >= -BinaryConstants.FLOAT32_MAX) &&
                        (value <= BinaryConstants.FLOAT32_MAX));
    splitFloat32(value);
    writeUint32(split64Low);
};

  
//writeFloat(987654321);
//writeFloat(987654336);
writeFloat(34028);

console.log(buf);
