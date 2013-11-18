var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var User = require('../domain/user');
var utils = require('../util/utils');
var consts = require('../../consts/consts');
var User = require('../domain/user');
var loginDao = module.exports;

var gdb = require('util');
/**
 * Get login_data by uid
 * @param {String} mysqlc mysql client for Master DB or Slave DB
 * @param {Number} uid
 * @returns {Object} loginData
 */
loginDao.getLoginDataByUid = function (mysqlc, uid, cb) {
  var selectSQL = 'select * from login_data where uid = ?';
  var args = [uid];

  mysqlc.query(selectSQL, args, function(err, res) {
    if (err !== null) {
      utils.invokeCallback(cb, err.message, null);
      return;
    }

    if (!!res && res.length === 1) {
      utils.invokeCallback(cb, null, new User(res[0]));
    }
    else {
      utils.invokeCallback(cb, null, null);
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
loginDao.getWorldPlayerByUidAndWorldId = function (mysqlc, uid, worldId, cb) {
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
