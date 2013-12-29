// test for battleAllData.js

var async = require('async');
var mysql = require('mysql');
var util = require('util');
var utils = require('../../../../app/util/utils');
var battleAllData = require('../../../../app/dao/union/battleAllData');

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
var playerId    = 2015;
var attackeeId  = 2020;

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
        battleAllData.calc(connection, playerId, attackeeId, callback);
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
      connection.query(q, function(err, report) {
        if (err) {
          console.log(err);
          console.log('---114---');
        }
        else { 
          //console.log(util.inspect(report, { showHidden: true, depth: null })); 
          connection.end();
        }
      });
    });
  });
