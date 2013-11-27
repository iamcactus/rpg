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
    database  : 'game_world_1001',
    insecureAuth: true
  }
);
var output = 'map.json';

connection.connect();

var selectMDSQL = 'select * from player_mission_log where player_id=? and mission_data_id in (?)';
var playerId = 10026;
var ids = [1,2,3,4,5];
var args = [playerId, ids];

async.auto({
  md: function (callback) {
    connection.query(selectMDSQL, args, function (err, res) {
      callback(err, res);
    });
  }
}, function (err, res) {
  if (err) throw err;
  //console.log(res);

  md = res.md;
  console.log(md);
  //console.log(JSON.stringify(md));
});

connection.end();
