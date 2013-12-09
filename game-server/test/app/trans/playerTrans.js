// test for worldPlayerTrans.js
var async = require('async');
var mysql = require('mysql');
var util = require('util');
var PlayerTrans = require('../../../app/trans/PlayerTrans');

var connection = mysql.createConnection(
  {
    host      : '127.0.0.1',
    user      : 'onemore',
    password  : 'onemore01',
    database  : 'game_world_1001',
    insecureAuth: true
  }
);

var uid = 1011;
var worldId = 1011;
var playerId = uid;
var name = uid+'de';
var lead = 10;
var sexType = 0;
var serialId = uid;
var cardId = uid;

var params = {
  serialId: serialId,
  cardId:   cardId,
  playerId: playerId,
  name:     name,
  sexType:  sexType,
  lead:     lead
}

connection.connect();

async.series([
  function(callback) {
    PlayerTrans.initPlayer(connection, params, callback);
  }
],
function(err, res) {
  if (err) {
    console.log('--151--');
    console.log(err);
  }
  else {
    console.log('--152--');
    console.log(res);
    connection.end();
  }
});
