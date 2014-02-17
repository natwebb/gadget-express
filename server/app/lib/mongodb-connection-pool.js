'use strict';

var MongoClient = require('mongodb').MongoClient;
var dbname;

exports.initialize = function(name){
  dbname = name;
  return connect;
};

function connect(req, res, next){
  if(!global.mdb){
    var connection = 'mongodb://localhost/' + dbname;

    MongoClient.connect(connection, function(err, mdb) {
      if(err){throw err;}
      global.mdb = mdb;
      console.log('Connected to MongoDB');

      next();
    });
  } else {
    next();
  }
}

