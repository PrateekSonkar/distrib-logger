EventEmitter = require('events').EventEmitter;
zmqReactor = new EventEmitter();
var mod = {};

mod.startEmmiting = function(){
  setInterval(function(){
    zmqReactor.emit('xcpu',"msg.stats")
  },1000);
};
mod.listserver = zmqReactor.on('xcpu',function(data){
  console.log("CPU event triggered" + data);
});

module.exports = mod;
