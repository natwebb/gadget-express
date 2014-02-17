'use strict';

var Gadget = require('../models/gadget');
var mongodb = require('mongodb');

exports.index = function(req, res){
  var db = global.mdb;
  var gadgets = db.collection('gadgets');

  gadgets.find().toArray(function(err, gadgets){
    res.send({gadgets:gadgets});
  });
};

exports.create = function(req, res){
  var db = global.mdb;
  var gadgets = db.collection('gadgets');
  var gadget = new Gadget(req.body);
  console.log(gadget);

  gadgets.insert(gadget, function(err, records){
    res.send(records[0]);
  });
};

exports.remove = function(req, res){
  var db = global.mdb;
  var gadgets = db.collection('gadgets');
  var id = new mongodb.ObjectID(req.body.id);
  gadgets.remove({_id:id}, function(err,count){
    res.send({gadgetId: req.body.id});
  });
};
