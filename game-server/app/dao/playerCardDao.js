var logger = require('pomelo-logger').getLogger(__filename);
var utils = require('../util/utils');

var playerCardDao = module.exports;

/**
 * Get an user's all cards by playerId
 * @param {String} mysqlc mysql client for Master DB or Slave DB
 * @param {Number} playerId.
 * @param {function} cb Callback function.
 */
playerCardDao.get = function(mysqlc, playerId, cb) {
	var selectSQL = 'select * from player_card where player_id=?';
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

/**
 * Get an user's card by playerId and serial id
 * @param {String} mysqlc mysql client for Master DB or Slave DB
 * @param {Number} playerId.
 * @param {Number} id id player_card
 * @returns {Object} player_card obj
 */
playerCardDao.getById = function(mysqlc, playerId, id, cb) {
	var selectSQL = 'select * from player_card where player_id=? and id=?';
	var args = [playerId, id];

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
 * Get an user's all cards by playerId
 * @param {String} mysqlc mysql client for Master DB or Slave DB
 * @param {Array} ids id in player_card
 * @param {function} cb Callback function.
 */
playerCardDao.getMulti = function(mysqlc, playerId, ids, cb) {
	var selectSQL = 'select * from player_card where id in (?) and player_id=?';
	var args = [ids, playerId];

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

playerCardDao.add = function(
  mysqlc, id, playerId, cardId, exp, level, maxLevel, cb
) {
  var insertSQL = 
    'insert into player_card(id, player_id, card_id, exp, level, max_level, created_on, updated_on) values (?,?,?, ?,?,?, ?,?)';
  var createdOn = Math.round(new Date().getTime()/1000); //unixtime
  var args = [id, playerId, cardId, exp, level, maxLevel, createdOn, createdOn];

  mysqlc.query(insertSQL, args, function(err, res) {
    if (err !== null) {
      utils.invokeCallback(cb, err, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        utils.invokeCallback(cb, null, true);
      }
      else {
        logger.error('add player_card Failed!');
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};

playerCardDao.update = function(mysqlc, id, exp, lv, cb) {
  var updateSQL = 
    'update player_card set exp=?, level=?, updated_on=? where id=?';
  var updatedOn = Math.round(new Date().getTime()/1000); //unixtime
  var args = [exp, lv, updatedOn, id];

  mysqlc.query(updateSQL, args, function(err, res) {
    if (err !== null) {
      utils.invokeCallback(cb, err, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        utils.invokeCallback(cb, null, true);
      }
      else {
        logger.error('update player_card Failed!');
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};

/**
 * arm card
 * @param {String} mysqlc mysqlc client for Master DB or Slave DB
 * @param {Number} id id in player_card
 * @param {function} cb Callback function.
 * @returns {object} true or false
 */
playerCardDao.arm = function(mysqlc, id, cb) {
  var updateSQL = 
    'update player_card set is_onarm=1, updated_on=? where id=?';
  var updatedOn = Math.round(new Date().getTime()/1000); //unixtime
  var args = [updatedOn, id];

  mysqlc.query(updateSQL, args, function(err, res) {
    if (err !== null) {
      utils.invokeCallback(cb, err, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        utils.invokeCallback(cb, null, true);
      }
      else {
        logger.error('arm player_card Failed!');
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};

playerCardDao.delete = function(mysqlc, id, cb) {
  var deleteSQL = 'delete from player_card where id=?';
  var args = [id];

  mysqlc.query(deleteSQL, args, function(err, res) {
    if (err !== null) {
      utils.invokeCallback(cb, err, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        utils.invokeCallback(cb, null, true);
      }
      else {
        logger.error('delete player_card Failed!' + id);
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};

/**
 * delete multi cards
 * @param {String} mysqlc mysqlc client for Master DB or Slave DB
 * @param {Array} ids id in player_card
 * @param {function} cb Callback function.
 * @returns {object} true or false
 */
playerCardDao.delMulti = function(mysqlc, ids, cb) {
  var deleteSQL = 'delete from player_card where id in (?)';
  var args = [ids];

  mysqlc.query(deleteSQL, args, function(err, res) {
    if (err !== null) {
      utils.invokeCallback(cb, err, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        utils.invokeCallback(cb, null, true);
      }
      else {
        logger.error('delMulti player_card Failed!' + ids);
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};
