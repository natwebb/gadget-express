'use strict';

module.exports = function(data){
  this.name = data.name || '';
  this.balance = parseInt(data.balance || 0);
  this.purchases = data.purchases || [];
};
