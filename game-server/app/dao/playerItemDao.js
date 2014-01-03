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

/**
 * Get an user's all players by userId
 * @param {Number} uid User Id.
 * @param {function} cb Callback function.
 */
playerItemDao.get = function(mysqlc, playerId, cb) {
	var selectSQL = 'select * from player_item where player_id=?';
	var args = [playerId];

	mysqlc.query(selectSQL, args, function(err, res) {
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

playerItemDao.add = function(mysqlc, id, playerId, itemId, num, cb) {
  var insertSQL = 
    'insert into play_item(id, player_id, item_id, num, created_on, updated_on) values (?,?,?,?, ?,?)';
  var createdOn = Math.round(new Date().getTime()/1000); //unixtime
  var args = [id, playerId, itemId, num, createdOn, createdOn];
  console.log(id, playerId, itemId, num, createdOn, createdOn);

  mysqlc.insert(insertSQL, args, function(err, res) {
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

playerItemDao.update = function(mysqlc, id, num, cb) {
  var updateSQL = 
    'update play_item set num=?, updated_on=? where id=?';
  var updatedOn = Math.round(new Date().getTime()/1000); //unixtime
  var args = [num, updatedOn, id];

  mysqlc.query(updateSQL, args, function(err, res) {
    if (err !== null) {
      utils.invokeCallback(cb, err, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        utils.invokeCallback(cb, null, true);
      }
      else {
        logger.error('add player_equip Failed!');
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};

playerItemDao.delete = function(mysqlc, id, cb) {
  var deleteSQL = 'delete from player_item where id=?';
  var args = [id];

  mysqlc.delete(deleteSQL, args, function(err, res) {
    if (err !== null) {
      utils.invokeCallback(cb, err, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        utils.invokeCallback(cb, null, true);
      }
      else {
        logger.error('delete player_item Failed!' + id);
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};

/**
 * delete multi items
 * @param {String} mysqlc mysqlc client for Master DB or Slave DB
 * @param {Array} ids id in player_item
 * @param {function} cb Callback function.
 * @returns {object} true or false
 */
playerItemDao.delMulti = function(mysqlc, ids, cb) {
  var deleteSQL = 'delete from player_item where id in (?)';
  var args = [ids];

  mysqlc.query(deleteSQL, args, function(err, res) {
    if (err !== null) {
      console.log(err);
      utils.invokeCallback(cb, err, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        utils.invokeCallback(cb, null, true);
      }
      else {
        logger.error('delMulti player_item Failed!' + id);
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};
