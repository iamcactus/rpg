// test for worldPlayerDao.js

var async = require('async');
var mysql = require('mysql');
var util = require('util');
var unitMeridianDao = require('../../../app/dao/unitMeridianDao');

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
var uid = 1009;
var worldId = 1001;
var playerId = uid;
var playerCardId = uid;
var positionId = 1;
var stoneId = 8001;

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
        unitMeridianDao.init(connection, playerCardId, positionId, callback);
      },
*/
      function(callback) {
        unitMeridianDao.get(connection, playerCardId, callback);
      },
      function(callback) {
        unitMeridianDao.update(connection, playerCardId, positionId, stoneId, callback);
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
      connection.query(q, function(err, res) {
        if (err) {
          console.log('---114---');
        }
        else {
          console.log(res);
          connection.end();
        }
        return 1;
      });
    });
  });

console.log('---113---');
