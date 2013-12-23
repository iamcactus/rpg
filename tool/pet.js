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
var output = 'pet.json';

connection.connect();

var selectPETSQL = 'select * from pet_data';

var pet;

async.auto({
  pet: function (callback) {
    connection.query(selectPETSQL, function (err, res) {
      callback(err, res);
    });
  }
}, function (err, res) {
  if (err) throw err;
  //console.log(res);
  //console.log(JSON.stringify(md));

  fs.writeFile(output, JSON.stringify(res.pet), function(err) {
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
