// test for playerEquipDao.js

var async = require('async');
var mysql = require('mysql');
var util = require('util');
var playerEquipDao = require('../../../app/dao/playerEquipDao');

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
var uid = 10016;
var id = uid;
var equipId = 5203;
var level = 1;
var isOnarm = 0;

var worldId = 1001;
var playerId = uid;
var ids = [1, 3, 5, 7, 9];

connection.connect();

  // begin transcation
  connection.query('BEGIN', function(err, rows) {
    if (err) {
	  	console.log('transaction begin failed' + err.stack);
			return;
    }
 
    async.series([
/*
      function(callback) {
        playerEquipDao.add(connection, id, playerId, equipId, level, isOnarm, callback);
      },
*/
      function(callback) {
        playerEquipDao.get(connection, playerId, 0, callback);
      },
      function(callback) {
        playerEquipDao.getMulti(connection, ids, callback);
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
        if (err) {
          console.log('---114---');
        }
        else {
          console.log('---115---');
          console.log(res);
          console.log('---116---');
          console.log(res1);
          connection.end();
        }
      });
    });
  });

console.log('---113---');
