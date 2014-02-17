'use strict';

var mongodb = require('mongodb');
var Gadget = require('../models/gadget');
var User = require('../models/user');

exports.purchase = function(req, res){
  var db = global.mdb;
  var gadgets = db.collection('gadgets');
  var users = db.collection('users');

  var gadget = new Gadget(req.body.gadget);
  var user = new User(req.body.user);

  var gadgetId = new mongodb.ObjectID(req.body.gadget._id);
  var userId = new mongodb.ObjectID(req.body.user._id);
  var number = parseInt(req.body.number);

  var total = (gadget.cost * number);

  user.balance -= total;
  for(var i=0;i<number;i++){
    user.purchases.push(gadget.name);
  }
  gadget.number -= number;

  var check = true;
  users.update({_id:userId}, user, function(err, count){if(count!==1){check=false;}});
  gadgets.update({_id:gadgetId}, gadget, function(err, count){if(count!==1){check=false;}});

  if(check){
    res.send({user:user, gadget:gadget, userId:userId, gadgetId:gadgetId});
  }
};
