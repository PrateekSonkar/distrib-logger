//  Initialize DB

var mongodb 						= require('mongodb'),
		MongoClient 				= mongodb.MongoClient,
    urlLogger		        = 'mongodb://localhost:27017/loggerdb';
var db                  = '';

exports.init = function(callback){
  MongoClient.connect(urlLogger, function(err, database) {
		if(err) {
			console.log(err);
			console.log("unable to connect Mongodb database on port 27017")
			callback(err,database);
		} else {
			console.log("Mongodb database connected to server on port 27017");
			exports.db = database;
			console.log("@@@@@@ I was @@@@ there");
			callback(err,database);
		}

	});
}
