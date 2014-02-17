'use strict';

module.exports = function(data){
  this.name = data.name || '';
  this.cost = parseInt(data.cost || 0);
  this.number = parseInt(data.number || 0);
};
