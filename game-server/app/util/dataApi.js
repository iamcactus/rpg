// require json files
//var task = require('../../config/data/task');
var mission = require('../../config/data/mission');
var map = require('../../config/data/map');
//var role = require('../../config/data/role');
/**
 * Data model `new Data()`
 *
 * @param {Array}
 *
 */

var Data = function(data) {
  this.data = data;
};

/*
var Data = function(data) {
  var fields = {};
  data[1].forEach(function(i, k) {
    fields[i] = k;
  });
  data.splice(0, 2);

  var result = {}, item;
  data.forEach(function(k) {
    item = mapData(fields, k);
    result[item.id] = item;
  });

  this.data = result;
};
*/

/**
 * map the array data to object
 *
 * @param {Object}
 * @param {Array}
 * @return {Object} result
 * @api private
 */
var mapData = function(fields, item) {
  var obj = {};
  for (var k in fields) {
    obj[k] = item[fields[k]];
  }
  return obj;
};

/**
 * find items by attribute
 *
 * @param {String} attribute name
 * @param {String|Number} the value of the attribute
 * @return {Array} result
 * @api public
 */
Data.prototype.findBy = function(attr, value) {
  var result = [];
  var i, item;
  for (i in this.data) {
    item = this.data[i];
    if (item[attr] == value) {
      result.push(item);
    }
  }
  return result;
};

Data.prototype.findBigger = function(attr, value) {
  var result = [];
  value = Number(value);
  var i, item;
  for (i in this.data) {
    item = this.data[i];
    if (Number(item[attr]) >= value) {
      result.push(item);
    }
  }
  return result;
};

Data.prototype.findSmaller = function(attr, value) {
  var result = [];
  value = Number(value);
  var i, item;
  for (i in this.data) {
    item = this.data[i];
    if (Number(item[attr]) <= value) {
      result.push(item);
    }
  }
  return result;
};

/**
 * find item by id
 *
 * @param id
 * @return {Obj}
 * @api public
 */
Data.prototype.findById = function(id) {
  console.log(id);
  console.log(this.data);
  //return this.data[id];
  return this.data[id - 1];
};

/**
 * find all item
 *
 * @return {array}
 * @api public
 */
Data.prototype.all = function() {
  return this.data;
};

module.exports = {
	//task: new Data(task),
	//role: new Data(role)
	mission: new Data(mission),
	map: new Data(map)
};