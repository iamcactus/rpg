var logger = require('pomelo-logger').getLogger(__filename);
var utils = require('../util/utils');

var playerUnitDao = module.exports;

/**
 * Get an user's all players by userId
 * @param {String} mysqlc mysql client for Master DB or Slave DB
 * @param {Number} uid User Id.
 * @param {function} cb Callback function.
 */
playerUnitDao.get = function(mysqlc, playerId, cb) {
	var selectSQL = 'select * from player_unit where player_id=?';
	var args = [playerId];

	mysqlc.query(selectSQL, args, function(err, res) {
		if(err) {
			utils.invokeCallback(cb, err, null);
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

playerUnitDao.add = function(mysqlc, playerId, positionId, playerCardId, cb) {
  var insertSQL = 
    'insert into player_unit(player_id, position_id, player_card_id, created_on, updated_on) values (?,?,?, ?,?)';
  var createdOn = Math.round(new Date().getTime()/1000); //unixtime
  var args = [playerId, positionId, playerCardId, createdOn, createdOn];
  console.log(playerId, positionId, playerCardId, createdOn, createdOn);

  mysqlc.query(insertSQL, args, function(err, res) {
    if (err !== null) {
			utils.invokeCallback(cb, err.message, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        utils.invokeCallback(cb, null, true);
      }
      else {
        logger.error('add player_unit Failed!');
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};

playerUnitDao.arm = function(mysqlc, playerId, positionId, armPosition, armId, cb) {
  var updateStr;
  var updatedOn = Math.round(new Date().getTime()/1000); //unixtime
  var updateSQL;

  switch (armPosition) {
    case 1:
      updateStr = 'stdskill1_id=?';
      break;
    case 2:
      updateStr = 'stdskill2_id=?';
      break;
    case 3:
      updateStr = 'weapon_id=?';
      break;
    case 4:
      updateStr = 'defender_id=?';
      break;
    case 5:
      updateStr = 'shoe_id=?';
      break;
    case 6:
      updateStr = 'jewelry_id=?';
      break;
  }
  var updateSQL = '';
  if (!!updateStr) {
    updateSQL = 'update player_unit set ' + updateStr + ', updated_on=? where player_id=? and position_id=?';
    var args = [armId, updatedOn, playerId, positionId];
    mysqlc.query(updateSQL, args, function(err, res) {
      if (err !== null) {
  			utils.invokeCallback(cb, err.message, null);
      }
      else {
        if (!!res && res.affectedRows > 0) {
          utils.invokeCallback(cb, null, true);
        }
        else {
          logger.error('arm player_unit Failed!');
          utils.invokeCallback(cb, null, false);
        }
      }
    });
  }
  else {
    logger.error('arm player_unit Failed! Did nothing');
    utils.invokeCallback(cb, null, false);
  }
};

playerUnitDao.delete = function(mysqlc, id, cb) {
  var deleteSQL = 'delete from player_unit where id=?';
  var args = [id];

  mysqlc.query(deleteSQL, args, function(err, res) {
    if (err !== null) {
			utils.invokeCallback(cb, err.message, null);
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
