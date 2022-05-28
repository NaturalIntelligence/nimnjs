var Benchmark = require('benchmark');
var suite = new Benchmark.Suite("JS features");
var bigNum = -98798798798798;
suite
.add('Buffer from byte string', function() {
    bigNum * -1;
})
.add('Buffer from byte array', function() {
  Math.abs(bigNum);
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