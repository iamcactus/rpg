var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
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

var playerParam = module.exports;

var mysqlc_w = pomelo.app.get(DBCONF.GAME_MASTER_W);
var mysqlc_r = pomelo.app.get(DBCONF.GAME_MASTER_R);

/**
 * Get player param by playerId
 * @param {String} mysqlc mysqlc client for Master DB or Slave DB
 * @param {String} playerId.
 * @param {function} cb Callback function.
 * @returns {object} playerData or null
 */
playerParam.get = function(mysqlc, playerId, cb) {
	var selectSQL = 'select * from player_param where playerId=?';
	var args = [playerId];

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
 * Initialize player param, ex. exp, level, etc
 * @param {String} mysqlc mysqlc client for Master DB or Slave DB
 * @param {String} playerID
 * @param {String} lead player's lead by now
 * @param {function} cb Callback function.
 * @returns {object} playerParam or null
 */
playerParam.init = function(mysqlc, playerId, lead, cb) {
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
  console.log('playerParam.initPlayerParam:' +playerId + lead + updatedOn);
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

/**
 * update player param, ex. exp, level, etc
 * @param {String} mysqlc mysqlc client for Master DB or Slave DB
 * @param {String} params, HASH for updated target colums
 * @param {function} cb Callback function.
 * @returns {object} true or false
 */
playerParam.update = function(mysqlc, params, cb) {
  if ( params === 'undefined' || params.length < 1 ) {
    utils.invokeCallback(cb, null, null);
  }
  
  var columns = ''; // updated target columns
  var args = [];    // the values for each column
  for (var key in params) {
    columns += params[key] + '=?, ';
    args.push(params[key]);
  }

  var updatedOn = Math.round(new Date().getTime()/1000); //unixtime
  args.push(updatedOn);
  args.push(playerId);
  var updateSQL = 'update player_param set ' + columns + 'updated_on=? where player_id=?';

  console.log(updateSQL);
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
