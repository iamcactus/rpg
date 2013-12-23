// Generate mission_pet into json
// the json will be read as an Object by dataApi

var fs = require('fs');
var mysql = require('mysql');
var async = require('async');
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
var output = 'natureCondition.json';

connection.connect();

var selectSQL = 'select card_id, group_concat(nature_id) as natures from nature_condition group by card_id';

function chg(str) {
  var a1 = str.split(',');
  var a2 = [];
  for (var i=0; i<a1.length; i++) {
    a2.push(parseInt(a1[i]));
  }
  return a2;
}

async.auto({
  nc: function (callback) {
    connection.query(selectSQL, function (err, res) {
      callback(err, res);
    });
  }
}, function (err, res) {
  if (err) throw err;
  //console.log(res);
  //console.log(JSON.stringify(md));
  var nc = res.nc;
  for (var k in nc) {
    nc[k].natures = chg(nc[k].natures);
  }

  fs.writeFile(output, JSON.stringify(nc), function(err) {
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
