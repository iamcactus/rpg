// Generate mission_equip into json
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
var output = 'equip.json';

connection.connect();

var selectEQUIPSQL = 'select * from equip_data';

async.auto({
  equip: function (callback) {
    connection.query(selectEQUIPSQL, function (err, res) {
      callback(err, res);
    });
  }
}, function (err, res) {
  if (err) throw err;
  //console.log(res);
  //console.log(JSON.stringify(md));

  fs.writeFile(output, JSON.stringify(res.equip), function(err) {
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
