// test for playerItemDao.js

var async = require('async');
var mysql = require('mysql');
var util = require('util');
var playerItemDao = require('../../../app/dao/playerItemDao');

var connection = mysql.createConnection(
  {
    host      : '127.0.0.1',
    user      : 'onemore',
    password  : 'onemore01',
    database  : 'game_world_1001',
    insecureAuth: true
  }
);

// pre set
var uid = 10035;
var worldId = 1001;
var playerId = uid;
var id = 4;
var num = 5;

connection.connect();

  // begin transcation
  connection.query('BEGIN', function(err, rows) {
    if (err) {
	  	console.log('transaction begin failed' + err.stack);
			return;
    }
 
    async.series([
      function(callback) {
        playerItemDao.update(connection, id, num, callback);
      },
      function(callback) {
        playerItemDao.get(connection, playerId, callback);
      }
    ],
    function(err, res) {
      var q; // query
      if (err) {
        q = 'ROLLBACK';
  	  	console.log('transaction query failed ' + err.message);
      }
      else {
        q = 'COMMIT';
      }
      connection.query(q, function(err, res1) {
        connection.end();
        if (err) {
          console.log(err);
          console.log('---114---');
        }
        else {
          console.log(res);
          console.log('---116---');
        }
      });
    });
  });

console.log('---113---');
