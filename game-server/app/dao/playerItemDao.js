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

var playerItemDao = module.exports;

var mysqlc_w = pomelo.app.get(DBCONF.GAME_MASTER_W);
var mysqlc_r = pomelo.app.get(DBCONF.GAME_MASTER_R);

/**
 * Get an user's all players by userId
 * @param {Number} uid User Id.
 * @param {function} cb Callback function.
 */
playerItemDao.get = function(playerId, cb) {
	var selectSQL = 'select * from player_item where player_id=?';
	var args = [playerId];

	mysqlc_r.query(selectSQL, args, function(err, res) {
    console.log('in playerItemDao.getAll');
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

playerItemDao.add = function(id, playerId, itemId, num, cb) {
  var insertSQL = 
    'insert into play_item(id, player_id, item_id, num, created_on, updated_on) values (?,?,?,?, ?,?)';
  var createdOn = Math.round(new Date().getTime()/1000); //unixtime
  var args = [id, playerId, itemId, num, createdOn, createdOn];
  console.log(id, playerId, itemId, num, createdOn, createdOn);

  mysqlc_w.insert(insertSQL, args, function(err, res) {
    if (err !== null) {
      console.log(err);
      cb({code: err.number, msg: err.message}, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        console.log('in playerItemDao.add');
        console.log(res);
        utils.invokeCallback(cb, null, true);
      }
      else {
        logger.error('add player_item Failed!');
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};

playerItemDao.delete = function(id, cb) {
  var deleteSQL = 'delete from play_item where id=?';
  var args = [id];
  console.log(id);

  mysqlc_w.delete(deleteSQL, args, function(err, res) {
    if (err !== null) {
      console.log(err);
      cb({code: err.number, msg: err.message}, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        console.log('in playerItemDao.delete');
        console.log(res);
        utils.invokeCallback(cb, null, true);
      }
      else {
        logger.error('delete player_item Failed!' + id);
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};

playerItemDao.getSequenceID = function(cb) {
  var sql = 'update seq_player_item set id=LAST_INSERT_ID(id+1)';

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
        logger.error('getSequenceID of player_item FAILER!');
        utils.invokeCallback(cb, null, false);
      }
    }
  });
} ;

