// test for worldPlayerTrans.js

var async = require('async');
var mysql = require('mysql');
var util = require('util');
var worldPlayerTrans = require('../../../app/trans/worldPlayerTrans');
var seqPlayer = require('../../../app/dao/seqPlayer');

var connection = mysql.createConnection(
  {
    host      : '127.0.0.1',
    user      : 'onemore',
    password  : 'onemore01',
    database  : 'game_master',
    insecureAuth: true
  }
);

var uid = 1014;
var worldId = 1010;
var playerId;

connection.connect();

async.auto({
  newPlayerId: function(callback) {
    seqPlayer.getSequenceID(connection, function(err, id) {
      if (err) {
        console.log('---140--');
      }
      else {
        console.log('---141---');
        playerId = id;
        callback(null, id);
      }
    });
  },
  worldPlayer: ['newPlayerId', function(callback) {
    worldPlayerTrans.createWorldPlayer(connection, uid, worldId, playerId, callback);
  }]
},
function(err, res) {
  if (err) {
    console.log('--151--');
    console.log(err);
  }
  else {
    console.log('--152--');
    console.log(res);
    //connection.end();
  }
});
