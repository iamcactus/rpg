var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var DBCONF = require('../../../shared/dbconf');
var LEVELCONF = require('../../../shared/levelConf');
var assert = require('assert');
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

var playerDao = module.exports;

var mysqlc_w = pomelo.app.get(DBCONF.GAME_MASTER_W);
var mysqlc_r = pomelo.app.get(DBCONF.GAME_MASTER_R);

/**
 * Get player data by uid (userId)
 * @param {String} mysqlc mysql client for Master DB or Slave DB
 * @param {Number} uid.
 * @param {function} cb Callback function.
 * @returns {object} playerData or null
 */
playerDao.getPlayersByUId = function(mysqlc, uid, cb) {
	var selectSQL = 'select * from player_data where uid=?';
	var args = [uid];

	mysqlc.query(selectSQL,args,function(err, res) {
		if(err) {
			utils.invokeCallback(cb, err.message, null);
			return;
		}

		if(!!res && res.length > 0) { //exists
			utils.invokeCallback(cb, null, res[0]);
		} else {
			utils.invokeCallback(cb, null, []);
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
			utils.invokeCallback(cb, err.message, null);
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
  mysqlc.insert(insertSQL, args, function(err, res) {
    if (err !== null) {
			utils.invokeCallback(cb, err, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        var player = {id:res.insertId, name:name, sexType:sexType};
        utils.invokeCallback(cb, null, player);
      }
      else {
        logger.error('initPlayerParam Failed!');
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};

/**
 * Initialize player param, ex. exp, level, etc
 * @param {String} mysqlc mysqlc client for Master DB or Slave DB
 * @param {String} playerID
 * @param {String} lead player's lead by now
 * @param {function} cb Callback function.
 * @returns {object} playerParam or null
 */
playerDao.initPlayerParam = function(mysqlc, playerId, lead, cb) {
  var insertSQL = 
    'insert into player_param(player_id, max_power, max_energy, lead, power, energy) values (?,?,?, ?,?,?)';
  var updatedOn = Math.round(new Date().getTime()/1000); //unixtime
  var args = [playerId, 
              LEVELCONF.ONE.POWER,
              LEVELCONF.ONE.ENERGY,
              lead,
              LEVELCONF.ONE.POWER,
              LEVELCONF.ONE.ENERGY
              ];
  console.log('playerDao.initPlayerParam:' +playerId + lead + updatedOn);
  mysqlc.insert(insertSQL, args, function(err, res) {
    if (err !== null) {
			utils.invokeCallback(cb, err.message, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        console.log(res);
        utils.invokeCallback(cb, null, res);
      }
      else {
        logger.error('initPlayerParam Failed!');
        utils.invokeCallback(cb, null, null);
      }
    }
  });
};

playerDao.getSequenceID = function(cb) {
  var sql = 'update seq_player set id=LAST_INSERT_ID(id+1)';

  // set mysql client with master
  mysqlc_w.query(sql, null, function(err, res) {
    if (err !== null) {
      utils.invokeCallback(cb, err.message, null);
    }
    else {
      if (!!res && res.affectedRows > 0 && res.insertId) {
        utils.invokeCallback(cb, null, res.insertId);
      }
      else {
        logger.error('getSequenceID of player FAILER!');
        utils.invokeCallback(cb, null, null);
      }
    }
  });
} ;

