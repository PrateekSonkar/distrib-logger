var zmq = require('zmq');
var publisher = zmq.socket('pub');
var appmetrics = require('appmetrics');
var monitoring = appmetrics.monitor();
var sName = "publisher2";

publisher.bind('tcp://*:5564', function(err) {
  if(err)
    console.log(err)
  else
    console.log('publishing on 5564…')
})

monitoring.on('cpu', function (cpu) {
    //console.log("CPU : " + JSON.stringify(cpu));
    var msg = {
      collectionName : 'cpu',
      stats : cpu,
      info : "localhost @ 5564  ",
      date : new Date().getTime(),
      sname : sName
    }
    publisher.send(JSON.stringify(msg));
});
monitoring.on('memory', function (memory) {
    //console.log("Memory : " + JSON.stringify(memory));
    var msg = {
      collectionName : 'memory',
      stats : memory,
      info : "localhost @ 5564  ",
      date : new Date().getTime(),
      sname : sName
    }
    publisher.send(JSON.stringify(msg));
});
monitoring.on('gc', function (gc) {
    //console.log("cligc : " + JSON.stringify(gc));
    var msg = {
      collectionName : 'gc',
      stats : gc,
      info : "localhost @ 5564  ",
      date : new Date().getTime(),
      sname : sName
    }
    publisher.send(JSON.stringify(msg));
});
monitoring.on('eventloop', function (eventloop) {
    //console.log("eventloop : " + JSON.stringify(eventloop));
    var msg = {
      collectionName : 'eventloop',
      stats : eventloop,
      info : "localhost @ 5564  ",
      date : new Date().getTime(),
      sname : sName
    }
    publisher.send(JSON.stringify(msg));
});
monitoring.on('loop', function (loop) {
    //console.log("loop : " + JSON.stringify(loop));
    var msg = {
      collectionName : 'loop',
      stats : loop,
      info : "localhost @ 5564  ",
      date : new Date().getTime(),
      sname : sName
    }
    publisher.send(JSON.stringify(msg));
});
