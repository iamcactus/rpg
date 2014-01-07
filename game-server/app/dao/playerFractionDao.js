var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var DBCONF = require('../../../shared/dbconf');
var utils = require('../util/utils');

var playerFractionDao = module.exports;

/**
 * Get an user's all fractions by playerId and type
 * @param {Number} playerId.
 * @param {Number} typeId defined in gameInit.js
 * @param {Number} star star for card
 * @param {function} cb Callback function.
 */
playerFractionDao.getByTypeAndStar = function(mysqlc, playerId, typeId, star, cb) {
	var selectSQL = 'select * from player_fraction where player_id=? and type=? and star=?';
	var args = [playerId, typeId, star];

	mysqlc.query(selectSQL, args, function(err, res) {
		if(err) {
			utils.invokeCallback(cb, err, null);
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

/**
 * Get an user's all fractions by playerId and type
 * @param {Number} playerId.
 * @param {Number} typeId defined in gameInit.js
 * @param {function} cb Callback function.
 */
playerFractionDao.getByType = function(mysqlc, playerId, typeId, cb) {
	var selectSQL = 'select * from player_fraction where player_id=? and type=?';
	var args = [playerId, typeId];

	mysqlc.query(selectSQL, args, function(err, res) {
		if(err) {
			utils.invokeCallback(cb, err, null);
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

/**
 * Get an user's all fractions by playerId
 * @param {Number} playerId.
 * @param {function} cb Callback function.
 */
playerFractionDao.getAll = function(mysqlc, playerId, cb) {
	var selectSQL = 'select * from player_fraction where player_id=?';
	var args = [playerId];

	mysqlc.query(selectSQL, args, function(err, res) {
		if(err) {
			utils.invokeCallback(cb, err, null);
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

playerFractionDao.add = function(mysqlc, playerId, type, star, num, cb) {
  var insertSQL = 
    'insert into player_fraction (player_id, type, star, num, created_on, updated_on) values (?,?,?,?, ?,?)';
  var createdOn = Math.round(new Date().getTime()/1000); //unixtime
  var args = [playerId, type, star, num, createdOn, createdOn];

  mysqlc.query(insertSQL, args, function(err, res) {
    if (err !== null) {
      utils.invokeCallback(cb, err, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        utils.invokeCallback(cb, null, res);
      }
      else {
        logger.error('add player_fraction Failed!');
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};

playerFractionDao.replace = function(mysqlc, playerId, type, star, num, cb) {
  var replaceSQL = 
    'replace into player_fraction (player_id, type, star, num, created_on, updated_on) values (?,?,?,?, ?,?)';
  var updatedOn = Math.round(new Date().getTime()/1000); //unixtime
  var args = [playerId, type, star, num, updatedOn, updatedOn];

  mysqlc.query(replaceSQL, args, function(err, res) {
    if (err !== null) {
      utils.invokeCallback(cb, err, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        utils.invokeCallback(cb, null, true);
      }
      else {
        logger.error('add player_fraction Failed!');
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};

playerFractionDao.update = function(mysqlc, playerId, type, star, fractionNum, cb) {
  var updateSQL = 
    'update player_fraction set num=num-?, updated_on=? where player_id=? and type=? and star=?';
  var updatedOn = Math.round(new Date().getTime()/1000); //unixtime
  var args = [fractionNum, updatedOn, playerId, type, star];

  mysqlc.query(updateSQL, args, function(err, res) {
    if (err !== null) {
      utils.invokeCallback(cb, err, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        utils.invokeCallback(cb, null, true);
      }
      else {
        logger.error('update player_fraction Failed!');
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};

playerFractionDao.delete = function(mysqlc, playerId, type, star, num, cb) {
  var deleteSQL = 
    'delete from player_fraction where player_id=? and type=? and star =?';
  var args = [playerId, type, star];

  mysqlc.query(deleteSQL, args, function(err, res) {
    if (err !== null) {
      utils.invokeCallback(cb, err, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        utils.invokeCallback(cb, null, true);
      }
      else {
        logger.error('delete player_fraction Failed!' + id);
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};
