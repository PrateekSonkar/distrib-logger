var MongoClient   = require('mongodb').MongoClient,
    assert        = require('assert'),
    ObjectID      = require('mongodb').ObjectID,
    mongodbLocal  = require('../config/dbConnection'),
    zmq = require('zmq'),
    EventEmitter = require('events').EventEmitter;
    zmqReactor = new EventEmitter();
    subscriber = zmq.socket('sub'),
    publisher =  zmq.socket('pub'),
    requester = requester = zmq.socket('req'), //will look into it later on
    subscriberMethods = {},
    requesterMethods = {},
    lio = "",
    serverHealth = require('../config/serverHealth');


var saveToDB = function (collectionName,stats,callback) {
  mongodbLocal.db.collection(collectionName).insert(stats,function(err,savedStats){
    callback(err,savedStats);
  });
}


subscriber.on('message',function(){ // data as param
  var msg = [];
    Array.prototype.slice.call(arguments).forEach(function(arg) {
        console.log("\t\tArg "+ arg);
        msg.push(JSON.parse(arg));

    });
    if(serverHealth.healthStats.serverEventTime[msg[0].sname]){
        serverHealth.healthStats.serverEventTime[msg[0].sname][msg[0].collectionName] = msg[0].date;
        console.log("\n\nBefore emmitng ::" + Boolean(lio));
        if(Boolean(lio)){
          console.log("After emmitng ::" + Boolean(lio));
          subscriberMethods.emitEvent(msg[0],msg[0].sname,lio)
        }
        msg[0].stats['serverid'] = msg[0].sname;
        saveToDB(msg[0].collectionName,msg[0].stats,function(err,savedStats){
          if(err){
            console.log("Error occured while saving stats : " + err);
          } else {
            //console.log("Stats saved successfully !!");
          }
        });

    } else {
      console.log("New server need to create event list @@");
      var newDt = new Date().getTime(),
      obj = {
        cpu       : newDt,
        memory    : newDt,
        gc        : newDt,
        eventloop : newDt,
        loop      : newDt
      };
      serverHealth.healthStats.serverEventTime[msg[0].sname] = obj;

    }
});

subscriber.subscribe('');

subscriberMethods.startListening = function(ip,port,io){
  console.log("\t\tstartListening io : " + Boolean(io));
  lio = io;
  console.log("startListening for "+ ip +" "+ port);
  console.log("lio : " + Boolean(lio));
  subscriber.connect('tcp://'+ip+':'+port);
}

subscriberMethods.emitEvent = function(data,server,lio){
  switch (data.collectionName) {
    case 'cpu': zmqReactor.emit('cpu',data.stats,server,lio);break;
    case 'memory': zmqReactor.emit('memory',data.stats,server,lio);break;
    case 'gc': zmqReactor.emit('gc',data.stats,server,lio);break;
    case 'eventloop': zmqReactor.emit('eventloop',data.stats,server,lio);break;
    case 'loop': zmqReactor.emit('loop',data.stats,server,lio);break;
    default: zmqReactor.emit('default',{});
  }
}

subscriberMethods.listenCpuEvent = zmqReactor.on('cpu',function(data,server,io){
  data.eventTime = new Date().getTime();
  io.to(server).emit('clicpu',data,server);
});

subscriberMethods.listenMemEvent = zmqReactor.on('memory',function(data,server,io){
  data.eventTime = new Date().getTime();
  io.to(server).emit('climemory',data,server);
});

subscriberMethods.listenGcEvent = zmqReactor.on('gc',function(data,server,io){
  data.eventTime = new Date().getTime();
  io.to(server).emit('cligc',data,server);
});

subscriberMethods.listenCpuEvent = zmqReactor.on('eventloop',function(data,server,io){
  data.eventTime = new Date().getTime();
  io.to(server).emit('clieventloop',data,server);
});

subscriberMethods.listenLoopEvent = zmqReactor.on('loop',function(data,server,io){
  data.eventTime = new Date().getTime();
  io.to(server).emit('cliloop',data,server);
});

module.exports = subscriberMethods;
