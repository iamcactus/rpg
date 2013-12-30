// test for unitMeridianDao.js

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
var playerId = 10035;
var ids = [10020];

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
        unitMeridianDao.add(connection, id, playerId, equipId, level, isOnarm, callback);
      },
*/
/*
      function(callback) {
        unitMeridianDao.get(connection, playerId, callback);
      },
*/
      function(callback) {
        unitMeridianDao.getMulti(connection, ids, callback);
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
      connection.query(q, function(err1, res1) {
        if (err1) {
          console.log('---114---');
        }
        else {
          console.log(res);
          if (!!err || !res) {
            console.log('Get playerMeridian failed!');
          }
          connection.end();
        }
      });
    });
  });

console.log('---113---');
