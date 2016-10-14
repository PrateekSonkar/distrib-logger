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
    serverHealth = require('../config/serverHealth');

var saveToDB = function (collectionName,stats,callback) {
  //console.log("saveToDB  : " + collectionName + " \n stats " + JSON.stringify(stats));
  mongodbLocal.db.collection(collectionName).insert(stats,function(err,savedStats){
    callback(err,savedStats);
  });
}

subscriberMethods.startListening = function(ip,port,io){

  console.log("startListening for "+ ip +" "+ port);
  subscriber.on('message',function(){ // data as param
    //console.log("firsthand ==> " + data + " ==> " + JSON.stringify(data));
    var msg = [];
      Array.prototype.slice.call(arguments).forEach(function(arg) {
          //console.log("Arguemtns "+arg);
          //console.log("Arg "+ JSON.parse(arg).collectionName);
          msg.push(JSON.parse(arg));
          //console.log("Pushing message !!" + msg[0] + "       "+typeof msg[0] + " Length " + msg.length);
      });
      //console.log("collectionName :"+msg[0].collectionName +" -- "+ msg[0].sname);
      //check if server have entry if not then create and assign
      if(serverHealth.healthStats.serverEventTime[msg[0].sname]){
        //console.log("@@ ** No need to create event list" + JSON.stringify(serverHealth.healthStats));
        //console.log("!! event time : " + serverHealth.healthStats.serverEventTime[msg[0].sname][msg[0].collectionName]);
        //console.log("^^ Recieved time : " + msg[0].date);
        if(serverHealth.healthStats.serverEventTime[msg[0].sname][msg[0].collectionName] != msg[0].date){
          //console.log("## b4 " + serverHealth.healthStats.serverEventTime[msg[0].sname][msg[0].collectionName]);

          serverHealth.healthStats.serverEventTime[msg[0].sname][msg[0].collectionName] = msg[0].date;
          //console.log("$$ af4 " + serverHealth.healthStats.serverEventTime[msg[0].sname][msg[0].collectionName]);
          subscriberMethods.emitEvent(msg[0],msg[0].sname,io);
          msg[0].stats['serverid'] = msg[0].sname;
          saveToDB(msg[0].collectionName,msg[0].stats,function(err,savedStats){
            if(err){
              console.log("Error occured while saving stats : " + err);
            } else {
              //console.log("Stats saved successfully !!");
            }
          });
        }
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
        //console.log("\n\n\n serverHealth.healthStats @@ "+ JSON.stringify(serverHealth.healthStats)+ "\n\n\n");
      }
    //var msg = JSON.parse(data);
    //console.log(msg.info + " ==> " + msg.date + " ==> " + msg.sname);
    //msg.pid = process.pid;
    //console.log("receing data :== > " + JSON.stringify(msg));
    //subscriberMethods.emitEvent(msg,io);

  });
  subscriber.connect('tcp://'+ip+':'+port);
  subscriber.subscribe('');
}

subscriberMethods.emitEvent = function(data,server,io){
  //console.log("\n\n\t@@@ emitEvent called for : " +data.collectionName +"===>"+ JSON.stringify(data) + " server " + server);
  //console.log("priting io : " + io);
  switch (data.collectionName) {
    case 'cpu': zmqReactor.emit('cpu',data.stats,server,io);break;
    case 'memory': zmqReactor.emit('memory',data.stats,server,io);break;
    case 'gc': zmqReactor.emit('gc',data.stats,server,io);break;
    case 'eventloop': zmqReactor.emit('eventloop',data.stats,server,io);break;
    case 'loop': zmqReactor.emit('loop',data.stats,server,io);break;
    default: zmqReactor.emit('default',{});
  }
}

subscriberMethods.listenCpuEvent = zmqReactor.on('cpu',function(data,server,io){
  console.log("CPU event triggered " + server);
  // console.log("Connected User : " + io.sockets.sockets.length);
  data.eventTime = new Date().getTime();
  io.to(server).emit('clicpu',data,server);
});

subscriberMethods.listenMemEvent = zmqReactor.on('memory',function(data,server,io){
  console.log("@@@Memory event triggered " + server);
  data.eventTime = new Date().getTime();
  io.to(server).emit('climemory',data,server);
});

subscriberMethods.listenGcEvent = zmqReactor.on('gc',function(data,server,io){
  //console.log("GC event triggered ");
  data.eventTime = new Date().getTime();
  io.to(server).emit('cligc',data,server);
});

subscriberMethods.listenCpuEvent = zmqReactor.on('eventloop',function(data,server,io){
  //console.log("Eventloop event triggered ");
  data.eventTime = new Date().getTime();
  io.to(server).emit('clieventloop',data,server);
});

subscriberMethods.listenLoopEvent = zmqReactor.on('loop',function(data,server,io){
  //console.log("Loop event triggere ");
  data.eventTime = new Date().getTime();
  io.to(server).emit('cliloop',data,server);
});

module.exports = subscriberMethods;
