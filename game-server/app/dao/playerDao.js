var logger = require('pomelo-logger').getLogger(__filename);
var LEVELCONF = require('../../../shared/levelConf');
var assert = require('assert');
var utils = require('../util/utils');
var PlayerData = require('../domain/PlayerData');

var playerDao = module.exports;

/**
 * Get player data by uid (userId)
 * @param {String} mysqlc mysql client for Master DB or Slave DB
 * @param {Number} playerId.
 * @param {function} cb Callback function.
 * @returns {object} playerData or null
 */
playerDao.getPlayerByPlayerId = function(mysqlc, playerId, cb) {
	var selectSQL = 'select * from player_data where player_id=?';
	var args = [playerId];

	mysqlc.query(selectSQL,args,function(err, res) {
		if(err) {
			utils.invokeCallback(cb, err, null);
			return;
		}

		if(!!res && res.length > 0) { //exists
			utils.invokeCallback(cb, null, res[0]);
		} else {
			utils.invokeCallback(cb, null, null); // the last "null" make sure "if(player)" be failed
		}
	});
};

/**
 * Get player data by name
 * @param {String} mysqlc mysqlc client for Master DB or Slave DB
 * @param {String} name.
 * @param {function} cb Callback function.
 * @returns {object} playerData or null
 */
playerDao.getPlayerByName = function(mysqlc, name, cb) {
	var selectSQL = 'select * from player_data where name=?';
	var args = [name];

	mysqlc.query(selectSQL,args,function(err, res) {
		if(err) {
			utils.invokeCallback(cb, err, null);
			return;
		}

		if(!!res && res.length > 0) { //exists
			utils.invokeCallback(cb, null, new PlayerData(res[0]));
		} else {
			utils.invokeCallback(cb, null, null); // the last "null" make sure "if(player)" be failed
		}
	});
};

/**
 * Initialize player data, ex. name, sexType, etc
 * @param {String} mysqlc mysqlc client for Master DB or Slave DB
 * @param {String} playerID
 * @param {String} name nickname of player
 * @param {String} sexType male:1, female:0, referring as game_world_[worldId].player_data
 * @param {function} cb Callback function.
 * @returns {object} playerData or null
 */
playerDao.initPlayerData = function(mysqlc, playerId, name, sexType, cb) {
  var insertSQL = 
    'insert into player_data(player_id, name, sex_type, created_on) values (?,?,?,?)';
  var createdOn = Math.round(new Date().getTime()/1000); //unixtime
  var args = [playerId, name, sexType, createdOn];
  mysqlc.query(insertSQL, args, function(err, res) {
    if (err !== null) {
			utils.invokeCallback(cb, err, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        var player = {playerId:playerId, name:name, sexType:sexType};
        utils.invokeCallback(cb, null, player);
      }
      else {
        logger.error('initPlayerParam Failed!');
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};
