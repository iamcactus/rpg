/*
output sample: 
 { nature_id: 10161,
   type: 1,
   target: 1,
   property: 2,
   effect: 20,
   opened_on: 1386654372,
   condition: [ 1101, 1102 ] 
 }
*/

var fs = require('fs');
var mysql = require('mysql');
var async = require('async');
var _ = require('underscore');
var util = require('util');
var connection = mysql.createConnection(
  {
    host      : '127.0.0.1',
    user      : 'onemore',
    password  : 'onemore01',
    database  : 'game_master',
    insecureAuth: true
  }
);
var output = 'nature.json';

connection.connect();

// generate an array of obj[key2], when obj[key1] === value1
function makeArray(obj, key1, value1, key2, cb) {
  var ids = [];
  _.map(obj, function(o) {
    if (o[key1] === value1) {
      ids.push(o[key2]);
    }
  });
  cb(null, ids);
}

// merge obj2 into obj1 by key1
// key1 is the common key both in obj1 and obj2
// key2 is the new hash key added into obj1
// key3 is the key in obj2, by which the values will be generated into an array
var merge = function(obj1, obj2, key1, key2, key3, cb) {
  var v1;
  async.map(obj1, function(item, callback) {
    v1 = item[key1];
    makeArray(obj2, key1, v1, key3, function(err, res) {
      item[key2] = res;
    });
    callback(null, item);
  }, function(err, results) {
    if (err) throw err;
    //console.log(results);
    cb(null, results);
  });
}

var selectNDSQL = 'select * from nature_data'; 
var selectNCSQL = 'select * from nature_condition';

var nd;
var nc = {};

async.auto({
  nd: function (callback) {
    connection.query(selectNDSQL, function (err, res1) {
      callback(err, res1);
    });
  },
  nc: function (callback) {
    connection.query(selectNCSQL, function (err, res2) {
      callback(err, res2);
    });
  },
  out: ['nd', 'nc', function(callback, res3) {
    nd = res3.nd;
    nc = res3.nc;

    // merge nc[card_id] as nd[condition] where nc[nature_id] eq nd[nature_id]
    merge(nd, nc, 'nature_id', 'condition', 'card_id', callback);
  }]
}, function (err, res) {
  if (err) {
    console.log(err);
  }
  //console.log(JSON.stringify(res.out));
  fs.writeFile(output, JSON.stringify(res.out), function(err) {
    if (err) {
      throw err;
    }
    else {
      console.log('output into ' + output);
      //console.log(md);
    }
  });
});

connection.end();
