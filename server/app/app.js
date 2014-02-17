'use strict';

var dbname = 'gadgetexpress';
var port = process.env.PORT || 4000;

var d = require('./lib/request-debug');
var connectMongo = require('./lib/mongodb-connection-pool').initialize(dbname);

var express = require('express');
var home = require('./routes/home');
var gadgets = require('./routes/gadgets');
var users = require('./routes/users');
var purchases = require('./routes/purchases');
var app = express();

/* --- pipeline begins */
app.use(connectMongo);
app.use(express.logger(':remote-addr -> :method :url [:status]'));
app.use(require('./lib/cors'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.get('/', d, home.index);
app.get('/gadgets', d, gadgets.index);
app.get('/users', d, users.index);
app.post('/gadgets', d, gadgets.create);
app.post('/users', d, users.create);
app.put('/purchases', d, purchases.purchase);
app.delete('/gadgets', d, gadgets.remove);
/* --- pipeline ends   */

var server = require('http').createServer(app);
server.listen(port, function(){
  console.log('Node server listening. Port: ' + port + ', Database: ' + dbname);
});

