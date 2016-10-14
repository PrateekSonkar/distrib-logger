var MongoClient   = require('mongodb').MongoClient,
    assert        = require('assert'),
    ObjectID      = require('mongodb').ObjectID,
    mongodbLocal  = require('./dbConnection');

// name of collections and queries associated to them !!
/*
*User profile
* KEYS : name, userid, pwd, role
*
*/


exports.findUser = function(filter,callback){
  mongodbLocal.db.collection('users').findOne(filter,function(err,result){
    callback(err,result);
  });
}

exports.createUser = function(userInfo,callback){
  mongodbLocal.db.collection('users').insert(userInfo,function(err,newUser){
    callback(err,newUser);
  });
}

exports.addServerForStats = function(newserver, callback){
  console.log("Into dbQueriesUsers addServerForStats : " + JSON.stringify(newserver));
  mongodbLocal.db.collection('monitoringserver').insert(newserver,function(err,newServer){
    console.log("addServerForStats : " + newServer);
    callback(err,newServer);
  });
}

exports.getAllServer = function(noObject,callback){
  console.log("Into dbQueriesUsers::getAllServer ");
  mongodbLocal.db.collection('monitoringserver').find({}).sort({createdAt:1}).toArray(function(err,allServer){
    console.log("getAllServer : " + JSON.stringify(allServer));
    callback(err,allServer);
  });
}

exports.updateServerDetail = function(criteria,newvalobj,callback){
  console.log("Into dbQueriesUsers::updateServerDetail ");
  mongodbLocal.db.collection('monitoringserver').findOneAndUpdate(criteria,
    {$set:newvalobj},
    {returnOriginal: false,upsert:false},
    function(err,updatedDoc){
      callback(err,updatedDoc)
    }
  )
}

exports.deleteServer = function(criteria,callback){
  console.log("Into dbQueriesUsers::deleteServer " + JSON.stringify(criteria));
  mongodbLocal.db.collection('monitoringserver').remove(criteria,function(err,removed){
    callback(err,removed);
  });
}
