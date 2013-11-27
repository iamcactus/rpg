// Generate mission_map into json
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
var output = 'map.json';

connection.connect();

var selectMDSQL = 'select map_id, group_concat(id) as ids, group_concat(mission_id) as mission_ids from mission_data group by map_id';

var md;

function chg(str) {
  var a1 = str.split(',');
  var a2 = [];
  for (var i=0; i<a1.length; i++) {
    a2.push(parseInt(a1[i]));
  }
  return a2;
}
async.auto({
  md: function (callback) {
    connection.query(selectMDSQL, function (err, res) {
      callback(err, res);
    });
  }
}, function (err, res) {
  if (err) throw err;
  //console.log(res);

  md = res.md;
  //console.log(md);
  //console.log(JSON.stringify(md));

  for (var k in md) {
    md[k].ids = chg(md[k].ids);
    md[k].mission_ids = chg(md[k].mission_ids);
  }

  fs.writeFile(output, JSON.stringify(md), function(err) {
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
