// Generate mission_item into json
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
var itemOutput     = 'item.json';

connection.connect();

var selectITEMSQL = 'select * from item_data';

async.auto({
  item: function (callback) {
    connection.query(selectITEMSQL, function (err, res) {
      callback(err, res);
    });
  }
}, function (err, res) {
  if (err) throw err;
  //console.log(res);
  //console.log(JSON.stringify(md));

  fs.writeFile(itemOutput, JSON.stringify(res.item), function(err) {
    if (err) {
      throw err;
    }
    else {
      console.log('all item data is output into ' + itemOutput);
      //console.log(md);
    }
  });
});

connection.end();
