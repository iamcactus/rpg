var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var DBCONF = require('../../../shared/dbconf');
//var LEVELCONF = require('../../../shared/levelConf');

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

var utils = require('../util/utils');
//var consts = require('../consts/consts');

var playerCardDao = module.exports;

var mysqlc_w = pomelo.app.get(DBCONF.GAME_MASTER_W);
var mysqlc_r = pomelo.app.get(DBCONF.GAME_MASTER_R);

/**
 * Get an user's all players by userId
 * @param {Number} uid User Id.
 * @param {function} cb Callback function.
 */
playerCardDao.get = function (playerId, cb) {
	var selectSQL = 'select * from player_card where player_id=?';
	var args = [playerId];

	mysqlc_r.query(selectSQL, args, function(err, res) {
    console.log('in playerCardDao.getAll');
    console.log(err);
    console.log(res);
		if(err) {
			utils.invokeCallback(cb, err.message, null);
			return;
		}
    else {
  		if(!!res && res.length > 0) { //exists
	  		utils.invokeCallback(cb, null, res);
		  } else {
			  utils.invokeCallback(cb, null, []);
		  }
    }
	});
};

playerCardDao.add = function (
  id, playerId, cardId, exp, level, evolvedCnt, maxLevel, cb
) {
  var insertSQL = 
    'insert into play_card(id, player_id, card_id, exp, level, evolved_cnt, max_level, created_on, updated_on) values (?,?,?, ?,?,?,?, ?,?)';
  var createdOn = Math.round(new Date().getTime()/1000); //unixtime
  var args = [id, playerId, cardId, exp, level, evolvedCnt, maxLevel, createdOn, createdOn];
  console.log(id, playerId, cardId, exp, level, evolvedCnt, maxLevel, createdOn, createdOn);

  mysqlc_w.insert(insertSQL, args, function(err, res) {
    if (err !== null) {
      console.log(err);
      cb({code: err.number, msg: err.message}, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        console.log('in playerCardDao.add');
        console.log(res);
        utils.invokeCallback(cb, null, true);
      }
      else {
        logger.error('add player_card Failed!');
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};

playerCardDao.delete = function (id, cb) {
  var deleteSQL = 'delete from play_card where id=?';
  var args = [id];
  console.log(id);

  mysqlc_w.delete(deleteSQL, args, function(err, res) {
    if (err !== null) {
      console.log(err);
      cb({code: err.number, msg: err.message}, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        console.log('in playerCardDao.delete');
        console.log(res);
        utils.invokeCallback(cb, null, true);
      }
      else {
        logger.error('delete player_card Failed!' + id);
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};

playerCardDao.getSequenceID = function (cb) {
  var sql = 'update seq_player_card set id=LAST_INSERT_ID(id+1)';

  // set mysql client with master
  mysqlc_w.query(sql, null, function(err, res) {
    if (err !== null) {
      console.log(err);
      utils.invokeCallback(cb, err.message, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        console.log(err);
        utils.invokeCallback(cb, null, res.updateid);
      }
      else {
        logger.error('getSequenceID of player_card FAILER!');
        utils.invokeCallback(cb, null, false);
      }
    }
  });
} ;

