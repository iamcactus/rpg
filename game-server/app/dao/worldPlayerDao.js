var logger = require('pomelo-logger').getLogger(__filename);
var utils = require('../util/utils');
var worldPlayerDao = module.exports;

/**
 * Get world_player by uid
 * @param {String} mysqlc mysql client for Master DB or Slave DB
 * @param {Number} uid
 * @param {Number} worldId
 * @returns {Object} world_player data
 */
worldPlayerDao.getByUid = function (mysqlc, uid, cb) {
  var selectSQL = 'select * from world_player where uid=?';
  var args = [uid];

  mysqlc.query(selectSQL, args, function(err, res) {
    if (!!err) {
      utils.invokeCallback(cb, err, null);
      return;
    }

    if (!!res && res.length > 0) {
      utils.invokeCallback(cb, null, res);
    }
    else {
      utils.invokeCallback(cb, null, []);
    }
  });
}

/**
 * Get world_player by uid_and_world_id
 * @param {String} mysqlc mysql client for Master DB or Slave DB
 * @param {Number} uid
 * @param {Number} world_id
 * @returns {Object} world_player data
 */
worldPlayerDao.getByUidAndWorldId = function (mysqlc, uid, worldId, cb) {
  var selectSQL = 'select * from world_player where uid=? and world_id=?';
  var args = [uid, worldId];

  mysqlc.query(selectSQL, args, function(err, res) {
    if (!!err) {
      utils.invokeCallback(cb, err, null);
      return;
    }
    if (!!res && res.length > 0) {
      utils.invokeCallback(cb, null, res);
    }
    else {
      utils.invokeCallback(cb, null, []);
    }
  });
}

/**
 * Insert world_player with uid_and_world_id
 * @param {String} mysqlc mysql client for Master DB
 * @param {Number} uid
 * @param {Number} world_id
 * @returns {Object} world_player data
 */
worldPlayerDao.createWorldPlayer = function (mysqlc, uid, worldId, playerId, cb) {
  var insertSQL = 'insert into world_player(uid, world_id, player_id, created_on) values (?,?,?,?)';
  var createdOn = Math.round(new Date().getTime()/1000); //unixtime
  var args = [uid, worldId, playerId, createdOn];
  mysqlc.query(insertSQL, args, function(err, res) {
    if (err !== null) {
      utils.invokeCallback(cb, err, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        utils.invokeCallback(cb, null, res);
      }
      else {
        utils.invokeCallback(cb, null, null);
      }
    }
  });
}

