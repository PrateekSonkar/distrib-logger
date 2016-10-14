var zmq = require('zmq');
var publisher = zmq.socket('pub');
var appmetrics = require('appmetrics');
var monitoring = appmetrics.monitor();
var sName = "publisher3";

publisher.bind('tcp://*:5565', function(err) {
  if(err)
    console.log(err)
  else
    console.log('publishing on 5565…')
})

monitoring.on('cpu', function (cpu) {
    //console.log("CPU : " + JSON.stringify(cpu));
    var msg = {
      collectionName : 'cpu',
      stats : cpu,
      info : "localhost @ 5565  ",
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
      info : "localhost @ 5565  ",
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
      info : "localhost @ 5565  ",
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
      info : "localhost @ 5565  ",
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
      info : "localhost @ 5565  ",
      date : new Date().getTime(),
      sname : sName
    }
    publisher.send(JSON.stringify(msg));
});
