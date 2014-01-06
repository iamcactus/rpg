// test for playerFractionDao.js

var async = require('async');
var mysql = require('mysql');
var util = require('util');
var playerFractionDao = require('../../../app/dao/playerFractionDao');

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

var worldId = 1001;
var playerId = uid;
var type1 = 101;
var type2 = 102;
var type3 = 103;
var star1 = 1;
var star2 = 2;
var star3 = 3;
var num1 = 4;
var num2 = 14;
var num3 = 24;
var fractionNum = 3;
/*
var num1 = 10;
var num2 = 20;
var num3 = 30;
*/
var ids = [1, 3];

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
        playerFractionDao.replace(connection, playerId, type1, star1, num1, callback);
      },
      function(callback) {
        playerFractionDao.replace(connection, playerId, type1, star2, num2, callback);
      },
      function(callback) {
        playerFractionDao.replace(connection, playerId, type1, star3, num3, callback);
      },
      function(callback) {
        playerFractionDao.replace(connection, playerId, type2, star3, num3, callback);
      },
      */
      function(callback) {
        playerFractionDao.update(connection, playerId, type1, star1, fractionNum, callback);
      },
      function(callback) {
        playerFractionDao.getAll(connection, playerId, callback);
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
