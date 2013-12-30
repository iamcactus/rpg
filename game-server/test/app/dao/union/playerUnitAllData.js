// test for playerAllData.js

var async = require('async');
var mysql = require('mysql');
var util = require('util');
var playerUnitAllData = require('../../../../app/dao/union/playerUnitAllData');

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
var worldId = 1001;
var playerId = 10035;

connection.connect();

  // begin transcation
  connection.query('BEGIN', function(err, rows) {
    if (err) {
	  	console.log('[register] transaction begin failed' + err.stack);
			return;
    }
 
    async.series([
      function(callback) {
        playerUnitAllData.get(connection, playerId, callback);
      }
    ],
    function(err, res) {
      var q; // query
      if (err) {
        q = 'ROLLBACK';
  	  	console.log('[register] transaction query failed ' + err.message);
      }
      else {
        //console.log('---115---');
        //console.log(res);
        q = 'COMMIT';
      }
      connection.query(q, function(err, res1) {
        if (err) {
          console.log(err);
          console.log('---114---');
        }
        else {
          connection.end();
        }
      });
    });
  });

console.log('---113---');
