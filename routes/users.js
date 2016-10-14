var express = require('express');
var router = express.Router();
var userCollection = require('../config/dbQueriesUsers');
var helper = require('./helper');
var serverHealth = require('../config/serverHealth');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   console.log("got request on users route");
//   res.io.emit("socketToMe", "users");
//   res.send('respond with a resource');
// });

router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login Page' });
});

router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', { title: 'Dashboard'});
});

router.get('/servers', function(req, res, next) {
  res.render('listserver', { title: 'Dashboard' });
});

router.post('/dummy',function(req, res, next){
  console.log("Recieved request" + JSON.stringify(req.body));
  res.json({status:true,value:1,def:{as:'lloq',ki:"1223"}});
});

router.post('/addserver',function(req, res, next){
  console.log("Add server request : " );
  console.log("helper : " + JSON.stringify(helper));
  helper.composeDoc(req.body,function(inputDoc){
    userCollection.addServerForStats(inputDoc,function(err,data){
      if(err){
        console.log("DB error for new server : " + err);
        res.json({status:false,info:err});
      } else {
        console.log("DB entry for new server : " + JSON.stringify(data));
        serverHealth.healthStats.servers[data.ops[0].sid] = {"dbid":data.ops[0]._id,"ip":data.ops[0].ip, "port":data.ops[0].port,serverId:data.ops[0].sid};
        serverHealth.healthStats.serverIds.push(data.ops[0].sid);
        res.json({status:true,servers:data});
      }
    });
  });
});

router.get('/getservers',function(req, res, next){
  console.log("Get server request ");
  userCollection.getAllServer({},function(err,allservers){
    if(err){
      console.log("DB error while finding servers : " + err);
      res.json({status:false,info:err});
    } else {      
      //console.log("DB entry for all server : " + allservers);
      res.json({status:true,servers:allservers});
    }
  });
})


module.exports = router;
