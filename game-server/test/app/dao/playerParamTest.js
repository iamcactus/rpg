// test for playerParamDao.js

var async = require('async');
var mysql = require('mysql');
var util = require('util');
var playerParamDao = require('../../../app/dao/playerParamDao');

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
var silver  = 100;
var exp     = 10;

var worldId = 1001;
var playerId = uid;
var params1 = {
  "exp":    exp,
  "silver": silver
};

var params2 = {
  "exp":    exp * 2,
  "silver": silver * 3
};

connection.connect();

  // begin transcation
  connection.query('BEGIN', function(err, rows) {
    if (err) {
	  	console.log('transaction begin failed' + err.stack);
			return;
    }
 
    async.series([
      function(callback) {
        playerParamDao.update(connection, params1, playerId, callback);
      },
      function(callback) {
        playerParamDao.update(connection, params2, playerId, callback);
      },
      function(callback) {
        playerParamDao.get(connection, playerId, callback);
      }
    ],
    function(err, res) {
      var q; // query
      if (err) {
        q = 'ROLLBACK';
  	  	console.log('transaction query failed ' + err);
        console.log(err);
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
