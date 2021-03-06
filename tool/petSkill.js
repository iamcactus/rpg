/*
output sample: 
 { skill_id: 10161,
   type: 1,
   target: 1,
   property: 2,
   effect: 20,
   opened_on: 1386654372,
   cosdition: [ 1101, 1102 ] 
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
var output = 'petSkill.json';

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

// generate an object by key1
function makeObject(obj, key1, value1, key2, cb) {
  var newObj = {};
  _.map(obj, function(o) {
    if (o[key1] === value1) {
      //console.log(o);
      console.log(o[key2]);
      newObj[o[key2]] = o;
    }
  });
  cb(null, newObj);
}

// merge obj2 into obj1 by key1
// key1 is the common key both in obj1 asd obj2
// key2 is the new hash key added into obj1
// key3 is the key in obj2, by which the values will be generated into an array
var merge = function(obj1, obj2, key1, key2, cb) {
  var v1;
  async.map(obj1, function(item, callback) {
    v1 = item[key1];
    makeObject(obj2, key1, v1, key2, function(err, res) {
      //item[key2] = res;
      //console.log(item);
      console.log(res);
      _.extend(item, res);
    });
    callback(null, item);
  }, function(err, results) {
    if (err) throw err;
    //console.log(results);
    cb(null, results);
  });
}

var selectPSDSQL = 'select * from pet_skill_data'; 
var selectPSESQL = 'select * from pet_skill_effect';

async.auto({
  psd: function (callback) {
    connection.query(selectPSDSQL, function (err, res1) {
      callback(err, res1);
    });
  },
  pse: function (callback) {
    connection.query(selectPSESQL, function (err, res2) {
      callback(err, res2);
    });
  },
  out: ['psd', 'pse', function(callback, res3) {
    psd = res3.psd;
    pse = res3.pse;

    // merge pse into psd[skill_id] where psd[skill_id] eq pse[skill_id]
    merge(psd, pse, 'skill_id', 'level', callback);
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
