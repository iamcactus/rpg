var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var DBCONF = require('../../../shared/dbconf');
var LEVELCONF = require('../../../shared/levelConf');

//var Player = require('../domain/entity/player');
var utils = require('../util/utils');
//var consts = require('../consts/consts');

var playerParamDao = module.exports;

/**
 * Get player param by playerId
 * @param {String} mysqlc mysqlc client for Master DB or Slave DB
 * @param {String} playerId.
 * @param {function} cb Callback function.
 * @returns {object} playerData or null
 */
playerParamDao.get = function(mysqlc, playerId, cb) {
	var selectSQL = 'select * from player_param where player_id=?';
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
 * Initialize player param, ex. exp, level, etc
 * @param {String} mysqlc mysqlc client for Master DB or Slave DB
 * @param {Number} playerID
 * @param {String} lead player's lead by now
 * @param {function} cb Callback function.
 * @returns {object} playerParam or null
 */
playerParamDao.init = function(mysqlc, playerId, lead, cb) {
  var insertSQL = 
    'insert into player_param(player_id, max_power, max_energy, lead, power, energy) values (?,?,?, ?,?,?)';
  var updatedOn = Math.round(new Date().getTime()/1000); //unixtime
  var LEVELONE = LEVELCONF["1"];
  var args = [playerId, 
              LEVELONE.POWER,
              LEVELONE.ENERGY,
              lead,
              LEVELONE.POWER,
              LEVELONE.ENERGY
              ];
  console.log('playerParamDao.initPlayerParam:' +playerId + lead + updatedOn);
  mysqlc.query(insertSQL, args, function(err, res) {
    if (err !== null) {
			utils.invokeCallback(cb, err, null);
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
 * @param {Number} playerID
 * @param {String} params, HASH for updated target colums
 * @param {function} cb Callback function.
 * @returns {object} true or false
 */
playerParamDao.update = function(mysqlc, params, playerId, cb) {
  if ( params === 'undefined') {
    utils.invokeCallback(cb, null, null);
  }
  
  var columns = ''; // updated target columns
  var args = [];    // the values for each column
  for (var key in params) {
    columns += key + '=?, ';
    args.push(params[key]);
  }

  var updatedOn = Math.round(new Date().getTime()/1000); //unixtime
  args.push(updatedOn);
  args.push(playerId);
  var updateSQL = 'update player_param set ' + columns + 'updated_on=? where player_id=?';

  //console.log(updateSQL);
  //console.log(args);
  mysqlc.query(updateSQL, args, function(err, res) {
    if (err !== null) {
			utils.invokeCallback(cb, err, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        utils.invokeCallback(cb, null, true);
      }
      else {
        logger.error('initPlayerParam Failed!');
        utils.invokeCallback(cb, null, false);
      }
    }
  });

};
