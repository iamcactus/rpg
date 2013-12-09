// test for worldPlayerDao.js

var async = require('async');
var mysql = require('mysql');
var util = require('util');
var worldPlayerDao = require('../../../app/dao/worldPlayerDao');

var connection = mysql.createConnection(
  {
    host      : '127.0.0.1',
    user      : 'onemore',
    password  : 'onemore01',
    database  : 'game_master',
    insecureAuth: true
  }
);

// pre set
var uid = 1009;
var worldId = 1001;
var playerId = uid;

var uid2 = 1009;
var deviceInfo = uid2 + 'de';
var loginName = uid2 + 'name';
var passwordHash = uid2 + 'psw';

var createWorldPlayer = function (mysqlc, uid, worldId, playerId, cb) {
  var insertSQL = 'insert into world_player(uid, world_id, player_id, created_on) values (?,?,?,?)';
  var createdOn = Math.round(new Date().getTime()/1000); //unixtime
  var args = [uid, worldId, playerId, createdOn];
  mysqlc.query(insertSQL, args, function(err, res) {
    if (err !== null) {
      cb (err, null);
    }
    else {
      cb(null, res);
    }
  });
};

var createUser = function (mysqlc, deviceInfo, loginName, passwordHash, cb) {
  var insertSQL = 'insert into login_data(device_info, login_name, password_hash, created_on) values (?,?,?,?)';
  var createdOn = Math.round(new Date().getTime()/1000); //unixtime
  var args = [deviceInfo, loginName, passwordHash, createdOn];
  mysqlc.query(insertSQL, args, function(err, res) {
    if (err !== null) {
      cb (err, null);
    }
    else {
      cb(null, res);
    }
  });
};

connection.connect();

  // begin transcation
  connection.query('BEGIN', function(err, rows) {
    if (err) {
	  	console.log('[register] transaction begin failed' + err.stack);
			return;
    }
 
    async.series([
      function(callback) {
        createUser(connection, deviceInfo, loginName, passwordHash, callback);
      },
      function(callback) {
        worldPlayerDao.createWorldPlayer(connection, uid, worldId, playerId, callback);
      }
    ],
    function(err, res) {
      var q; // query
      if (err) {
        q = 'ROLLBACK';
  	  	console.log('[register] transaction query failed ' + err.message);
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
