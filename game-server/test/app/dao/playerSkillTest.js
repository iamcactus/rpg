// test for playerSkillDao.js

var async = require('async');
var mysql = require('mysql');
var util = require('util');
var playerSkillDao = require('../../../app/dao/playerSkillDao');

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
var skillId = 5203;
var level = 1;
var isOnarm = 0;

var worldId = 1001;
var playerId = uid;
var ids = [1011];

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
        playerSkillDao.delete(connection, id, callback);
      },
      function(callback) {
        playerSkillDao.add(connection, id, playerId, skillId, 0, level, 
          function(err, res) {
            if (err) {
              callback(err, null);
            }
            playerSkillDao.arm(connection, id, callback); 
          });
      },
      function(callback) {
        playerSkillDao.get(connection, playerId, 0, callback);
      },
      function(callback) {
        playerSkillDao.lvUp(connection, id, 100, 1, callback);
      },
      function(callback) {
        playerSkillDao.getMulti(connection, ids, callback);
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
