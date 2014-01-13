// test for playerPetDao.js

var async = require('async');
var mysql = require('mysql');
var util = require('util');
var playerPetDao = require('../../../app/dao/playerPetDao');

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
var uid   = 10016;
var id    = uid;
var petId = 2401;
var exp   = 10000;
var level = 10;
var isOnarm     = 0;
var positionId  = 1;
var petSkillId  = uid;

var worldId = 1001;
var playerId = uid;
var ids = [2015, 2020, 10016];

connection.connect();

  // begin transcation
  connection.query('BEGIN', function(err, rows) {
    if (err) {
	  	console.log('transaction begin failed' + err.stack);
			return;
    }
 
    async.series([
      function(callback) {
        playerPetDao.add(connection, id, playerId, petId, callback);
      },
      function(callback) {
        playerPetDao.get(connection, playerId, isOnarm, callback);
      },
      function(callback) {
        playerPetDao.arm(connection, id, callback);
      },
      function(callback) {
        playerPetDao.updateExp(connection, id, exp, level, callback);
      },
      function(callback) {
        playerPetDao.updateSkill(connection, id, positionId, petSkillId, callback);
      },
      function(callback) {
        playerPetDao.getMulti(connection, ids, callback);
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
