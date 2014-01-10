// test for playerCardDao.js

var async = require('async');
var mysql = require('mysql');
var util = require('util');
var playerCardDao = require('../../../app/dao/playerCardDao');

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
var id = uid;

var exp = 10;
var lv = 2;

var worldId = 1001;
var playerId = uid;
var id1 = 10033;
var id2 = 10034;
var id3 = 10035;
var ids = [id1, id2, id3];

connection.connect();

  // begin transcation
  connection.query('BEGIN', function(err, rows) {
    if (err) {
	  	console.log('transaction begin failed' + err.stack);
			return;
    }
 
    async.series([
      function(callback) {
        playerCardDao.update(connection, id, exp, lv, callback);
      },
      function(callback) {
        playerCardDao.getMulti(connection, playerId, ids, callback);
      }
    ],
    function(err, res) {
      var q; // query
      if (err) {
        q = 'ROLLBACK';
  	  	console.log('transaction query failed ' + err);
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
