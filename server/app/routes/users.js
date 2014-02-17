'use strict';

var User = require('../models/user');

exports.index = function(req, res){
  var db = global.mdb;
  var users = db.collection('users');

  users.find().toArray(function(err, users){
    res.send({users:users});
  });
};

exports.create = function(req, res){
  var db = global.mdb;
  var users = db.collection('users');
  var user = new User(req.body);

  users.insert(user, function(err, records){
    res.send(records[0]);
  });
};
