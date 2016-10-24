var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var appmetrics = require('appmetrics');
var monitoring = appmetrics.monitor();
var serverHealth = require('./config/serverHealth');
var pubsub = require('./routes/pubsub');
var MongoClient   = require('mongodb').MongoClient;
var assert        = require('assert');
var ObjectID      = require('mongodb').ObjectID;
var db  = require('./config/dbConnection');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
db.init(function(err,database){
  if(database){
    database.collection('monitoringserver').find({}).sort({createdAt:1}).toArray(function(err,allServer){
      if(!err && allServer.length > 0){
        serverHealth.healthStats.length = allServer.length;
        for(var index = 0; index < allServer.length; index++){
          serverHealth.healthStats.servers[allServer[index].sid] = {"dbid":allServer[index]._id,"ip":allServer[index].ip, "port":allServer[index].port,serverId:allServer[index].sid};
          serverHealth.healthStats.serverIds.push(allServer[index].sid);
          console.log("About to listent ",allServer[index].ip,allServer[index].port);
          pubsub.startListening(allServer[index].ip,allServer[index].port,io);
        }
      } else {
        console.log("Nothing to run !!");
      }
    });
  }
});

var emitHealth = function(status,sid,isConnected){
  io.emit('health',{
    status:status,
    sid:sid,
    isConnected : isConnected
  });
}

var sendMail = function(server,ip){
  console.log('server is down !');
}

setInterval(function(){
  console.log("Length set Interval !! " + serverHealth.healthStats.length + " \t\t " + serverHealth.healthStats.serverIds.length);
  if(serverHealth.healthStats.serverIds.length > serverHealth.healthStats.length){
      console.log("Length mis-matched !! " + serverHealth.healthStats.length + " \t\t " + serverHealth.healthStats.serverIds.length);
      pubsub.startListening(serverHealth.healthStats.servers[serverHealth.healthStats.serverIds[serverHealth.healthStats.serverIds.length-1]].ip,serverHealth.healthStats.servers[serverHealth.healthStats.serverIds[serverHealth.healthStats.serverIds.length-1]].port,io);
      serverHealth.healthStats.length = serverHealth.healthStats.serverIds.length;
  }
  var currDate = new Date().getTime();
  console.log("currDate "+ currDate);
  for(var server = 0;server < serverHealth.healthStats.serverIds.length ; server++){
    if(serverHealth.healthStats.serverEventTime[serverHealth.healthStats.serverIds[server]]){
      var tDiff = (currDate - serverHealth.healthStats.serverEventTime[serverHealth.healthStats.serverIds[server]].cpu)/1000;
    } else {
      tDiff = undefined;
    }
    if(tDiff <= 5){
      emitHealth('green',serverHealth.healthStats.servers[serverHealth.healthStats.serverIds[server]].serverId,Boolean(serverHealth.healthStats.serverEventTime[serverHealth.healthStats.serverIds[server]]));
    } else if(tDiff > 5 && tDiff < 10) {
      emitHealth('yellow',serverHealth.healthStats.servers[serverHealth.healthStats.serverIds[server]].serverId,Boolean(serverHealth.healthStats.serverEventTime[serverHealth.healthStats.serverIds[server]]));
    } else {
      emitHealth('red',serverHealth.healthStats.servers[serverHealth.healthStats.serverIds[server]].serverId,Boolean(serverHealth.healthStats.serverEventTime[serverHealth.healthStats.serverIds[server]]));
      sendMail()
    }
  }
},2000);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function(req, res, next){
  console.log("Midle e");
  res.io = io;
  next();
});
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


//establishing socket.io connection
io.on('connection', function (socket) {
  console.log("@@==@@ some connect " + socket);
  socket.join(serverHealth.healthStats.serverIds[0]);
  socket.emit('listeningto', { listeningTo: serverHealth.healthStats.serverIds[0] });
  socket.on('changeserver',function(data){
    console.log('request recied for CHANGESERVER');
    if(data.fromserver){
      socket.leave(data.fromserver);
    }
    if(data.toserver){
      socket.join(data.toserver);
    }
  });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = {app:app,server:server};
