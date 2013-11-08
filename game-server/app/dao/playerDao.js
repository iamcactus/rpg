var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
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

var Player = require('../domain/entity/player');
var utils = require('../util/utils');
//var consts = require('../consts/consts');

var playerDao = module.exports;

/**
 * Get an user's all players by userId
 * @param {String} dbhandle handle for Master DB or Slave DB
 * @param {Number} uid User Id.
 * @param {function} cb Callback function.
 */
playerDao.getPlayersByUid = function(dbhandle, uid, cb){
  var mysqlc = pomelo.app.get(dbhandle);
  if (!mysqlc) {
      // err handling should be done in caller side
			utils.invokeCallback(cb, null, []);
      return;
  }

	var selectSQL = 'select * from player_data where uid = ?';
	var args = [uid];

	mysqlc.query(selectSQL,args,function(err, res) {
    console.log('in playerDao.getPlayersByUid');
    console.log(err);
    console.log(cb);
    console.log(res);
		if(err) {
			utils.invokeCallback(cb, err.message, null);
			return;
		}

		if(!!res && res.length > 0) { //exists
			utils.invokeCallback(cb, null, new Player(res[0]));
		} else {
			utils.invokeCallback(cb, null, []);
		}
	});
};
