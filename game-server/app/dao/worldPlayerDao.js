var logger = require('pomelo-logger').getLogger(__filename);
var utils = require('../util/utils');
var worldPlayerDao = module.exports;

/**
 * Get world_player by uid_and_world_id
 * @param {String} mysqlc mysql client for Master DB or Slave DB
 * @param {Number} uid
 * @param {Number} world_id
 * @returns {Object} world_player data
 */
worldPlayerDao.getWorldPlayerByUidAndWorldId = function (mysqlc, uid, worldId, cb) {
  var selectSQL = 'select * from world_player where uid=? and world_id=?';
  var args = [uid, worldId];

  mysqlc.query(selectSQL, args, function(err, res) {
    if (err !== null) {
      utils.invokeCallback(cb, err.message, null);
      return;
    }

    if (!!res && res.length === 1) {
      utils.invokeCallback(cb, null, res[0]);
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
      utils.invokeCallback(cb, err.message, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        console.log(res);
        utils.invokeCallback(cb, null, res);
      }
      else {
        utils.invokeCallback(cb, null, null);
      }
    }
  });
}

