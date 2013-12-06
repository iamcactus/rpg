var logger = require('pomelo-logger').getLogger(__filename);
//var pomelo = require('pomelo');
var DBCONF = require('../../../shared/dbconf');
var LEVELCONF = require('../../../shared/levelConf');
/*
var dataApi = require('../util/dataApi');
var User = require('../domain/user');
var consts = require('../consts/consts');
var equipmentsDao = require('./equipmentsDao');
var bagDao = require('./bagDao');
var fightskillDao = require('./fightskillDao');
var taskDao = require('./taskDao');
var async = require('async');
*/

var util = require('util');

//var Player = require('../domain/entity/player');
var utils = require('../util/utils');
//var consts = require('../consts/consts');

var playerMissionLog = module.exports;

//var mysqlc_w = pomelo.app.get(DBCONF.GAME_MASTER_W);
//var mysqlc_r = pomelo.app.get(DBCONF.GAME_MASTER_R);

/**
 * Get player's mission history by playerId
 * @param {String} mysqlc mysqlc client for Master DB or Slave DB
 * @param {Number} playerID
 * @param {String} ids id from mission_data
 * @param {function} cb Callback function.
 * @returns {object} playerData or null
 */
playerMissionLog.get = function(mysqlc, playerId, ids, cb) {
	var selectSQL = 'select * from player_mission_log where player_id=? and mission_data_id in (?)' ;
	var args = [playerId, ids];

	mysqlc.query(selectSQL,args,function(err, res) {
		if(err) {
			utils.invokeCallback(cb, err, null);
			return;
		}
		if(!!res && res.length > 0) { //exists
			utils.invokeCallback(cb, null, res);
		} else {
			utils.invokeCallback(cb, null, null); // the last "null" make sure "if(player)" be failed
		}
	});
};

/**
 * Log player's mission history
 * @param {String} mysqlc mysqlc client for Master DB or Slave DB
 * @param {Number} playerID
 * @param {Number} missionDataId id from mission_data
 * @param {Number} clearNum cleared times during one day
 * @param {function} cb Callback function.
 * @returns {Boolean} true of false
 */
playerMissionLog.insert = function(mysqlc, playerId, missionDataId, clearNum, cb) {
  var insertSQL = 'insert into player_mission_log(player_id, mission_data_id, clear_num, created_on, updated_on) values(?,?,?, ?,?)';
  var createdOn = Math.round(new Date().getTime()/1000); //unixtime
  var updatedOn = createdOn;
  var args = [playerId, missionDataId, clearNum, createdOn, updatedOn]; 
  console.log('playerMissionLog.add:' +playerId + ':' + missionDataId + ':' + clearNum);
  mysqlc.insert(insertSQL, args, function(err, res) {
    if (err !== null) {
			utils.invokeCallback(cb, err.message, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        console.log(res);
        utils.invokeCallback(cb, null, true);
      }
      else {
        logger.error('initPlayerParam Failed!');
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};

/**
 * Log player's mission history
 * @param {String} mysqlc mysqlc client for Master DB or Slave DB
 * @param {Number} playerID
 * @param {Number} missionDataId id from mission_data
 * @param {Number} clearNum cleared times during one day
 * @param {function} cb Callback function.
 * @returns {Boolean} true of false
 */
playerMissionLog.update = function(mysqlc, playerId, missionDataId, clearNum, cb) {
  var cnt = (clearNum > 1 ) ? clearNum : 1; // there maybe used SAODANG, which do the mission many times in one click
  var updatedOn = Math.round(new Date().getTime()/1000); //unixtime
  var updateSQL = 'update player_mission_log set clear_num=clear_num+?, updated_on=? where player_id=? and mission_data_id=?';
  var args = [clearNum, updateOn, playerId, missionDataId]; 
  console.log('playerMissionLog.add:' +playerId + ':' + missionDataId + ':' + clearNum);
  mysqlc.update(updateSQL, args, function(err, res) {
    if (err !== null) {
			utils.invokeCallback(cb, err.message, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        console.log(res);
        utils.invokeCallback(cb, null, true);
      }
      else {
        logger.error('initPlayerParam Failed!');
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};
