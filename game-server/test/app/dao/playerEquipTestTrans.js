// test for playerEquipDao.js

var async = require('async');
var mysql = require('mysql');
var util = require('util');
var playerEquipDao = require('../../../app/dao/playerEquipDao');
var playerCardDao = require('../../../app/dao/playerCardDao');
var transQueue = require('../../../../web-server/lib/dao/mysql/transQueue');

// pre set
var uid = 802;
var id = uid;
var equipId = 5203;
var level = 1;
var isOnarm = 0;

var worldId = 1001;
var playerId = uid;
var ids = [1, 3, 5, 7, 9];

var dbhandle = 'game_world_1001_m';
var client = new transQueue(dbhandle).client;

var testTrans = function(client, cb) {
  var trans = client.startTransaction();
  var insertSQL = 'insert into player_equip(id, player_id, equip_id, level, created_on, updated_on) values (?,?,?, ?, ?,?)';
  var updateSQL = 'update player_equip set is_onarm=1, updated_on=? where id=?';

  var createdOn = Math.round(new Date().getTime()/1000); //unixtime
  var updatedOn = Math.round(new Date().getTime()/1000); //unixtime

  var insertArgs = [id, playerId, equipId, level, createdOn, createdOn];
  var updateArgs = [updatedOn, id];

  trans.query(insertSQL, insertArgs, function(err, info) {
    if (err) {
      trans.rollback();
      cb(err, null);
    }
    else {
      trans.query(updateSQL, updateArgs, function(err, res) {
        trans.commit();
        cb(null, res);
      });
    }
  });
  trans.execute();
};

testTrans(client, function(err, res) {
  if (err) {
    console.log('---114---');
    console.log(err);
    client.end();
  }
  else {
    console.log('---115---');
    console.log(res);
    client.end();
  }
});

/*
var testTrans = function(trans, cb) {
  var trans = client.startTransaction();
  playerEquipDao.add(trans, id, playerId, equipId, level, isOnarm, function(err, res) {
    console.log(err);
    console.log(res);
    console.log('---123---');
    if (!!err) {
      console.log('---117---');
      console.log(err);
      trans.rollback();
      //trans.execute();
    }
    else {
      console.log('---118---');
      playerEquipDao.get(trans, playerId, 0, function(err, res1) {
        if (!!err) {
          console.log('---121---');
          console.log(err);
          trans.rollback();
          //trans.execute();
        }
        else {
          console.log('---122---');
          console.log(res1);
          trans.commit();
          //trans.execute();
          cb(res1);
        }
      });
    }
  });
  trans.execute();
  console.log('---119---');
};
*/

