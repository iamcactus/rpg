// test for playerAllData.js

var async = require('async');
var mysql = require('mysql');
var util = require('util');
var playerAllData = require('../../../../app/dao/union/playerAllData');

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
//var playerId = 2020;
var playerId = 10035;

connection.connect();

  // begin transcation
  connection.query('BEGIN', function(err, rows) {
    if (err) {
	  	console.log('[register] transaction begin failed');
      console.log(err);
			return;
    }
 
    async.series([
      function(callback) {
        playerAllData.get(connection, playerId, callback);
      }
    ],
    function(err, res) {
      var q; // query
      if (err) {
        q = 'ROLLBACK';
  	  	console.log('[register] transaction query failed ');
        console.log(err);
      }
      else {
        q = 'COMMIT';
      }
      connection.query(q, function(err, res1) {
        if (err) {
          console.log(err);
          console.log('---114---');
        }
        else {
          console.log(util.inspect(res, { showHidden: true, depth: null }));
          connection.end();
        }
      });
    });
  });
