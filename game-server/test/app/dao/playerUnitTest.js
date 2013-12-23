// test for playerUnitDao.js

var async = require('async');
var mysql = require('mysql');
var util = require('util');
var playerUnitDao = require('../../../app/dao/playerUnitDao');

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
var uid = 1011;
var id = uid;
var unitId = 5203;
var level = 1;
var isOnarm = 0;

var worldId = 1001;
var playerId = uid;
var playerCardId = uid;
var positionId = 1;
var armPosition = 1;
var armId = 1023;

connection.connect();

  // begin transcation
  connection.query('BEGIN', function(err, rows) {
    if (err) {
	  	console.log('transaction begin failed');
      console.log(err);
			return;
    }
 
    async.series([
      function(callback) {
        playerUnitDao.add(connection, playerId, positionId, playerCardId, callback);
      },
      function(callback) {
        playerUnitDao.get(connection, playerId, callback);
      },
      function(callback) {
        playerUnitDao.arm(connection, playerId, positionId, armPosition, armId, callback);
      }
    ],
    function(err, res) {
      var q; // query
      if (err) {
        q = 'ROLLBACK';
  	  	console.log('transaction query failed ');
        console.log(err);
      }
      else {
        q = 'COMMIT';
      }
      connection.query(q, function(err, res1) {
        if (err) {
        }
        else {
          console.log(res);
          connection.end();
        }
      });
    });
  });
