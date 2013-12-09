var logger = require('pomelo-logger').getLogger(__filename);
var utils = require('../util/utils');

var playerCardDao = module.exports;

/**
 * Get an user's all players by userId
 * @param {String} mysqlc mysql client for Master DB or Slave DB
 * @param {Number} uid User Id.
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

playerCardDao.add = function(
  mysqlc, id, playerId, cardId, exp, level, evolvedCnt, maxLevel, cb
) {
  var insertSQL = 
    'insert into player_card(id, player_id, card_id, exp, level, evolved_cnt, max_level, created_on, updated_on) values (?,?,?, ?,?,?,?, ?,?)';
  var createdOn = Math.round(new Date().getTime()/1000); //unixtime
  var args = [id, playerId, cardId, exp, level, evolvedCnt, maxLevel, createdOn, createdOn];
  console.log(id, playerId, cardId, exp, level, evolvedCnt, maxLevel, createdOn, createdOn);

  mysqlc.query(insertSQL, args, function(err, res) {
    if (err !== null) {
      cb({code: err.number, msg: err.message}, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        utils.invokeCallback(cb, null, res);
      }
      else {
        logger.error('add player_card Failed!');
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
      console.log(err);
      cb({code: err.number, msg: err.message}, null);
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
