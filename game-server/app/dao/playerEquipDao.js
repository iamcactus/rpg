var logger = require('pomelo-logger').getLogger(__filename);
var utils = require('../util/utils');

var playerEquipDao = module.exports;

/**
 * Get an user's all equips by playerId
 * @param {String} mysqlc mysql client for Master DB or Slave DB
 * @param {Number} playerId.
 * @param {Number} isOnarm 1:on, 0:off
 * @param {function} cb Callback function.
 */
playerEquipDao.get = function(mysqlc, playerId, isOnarm, cb) {
	var selectSQL = 'select * from player_equip where player_id=?';
	var args = [playerId];

  if (isOnarm === 1) {
	  selectSQL = 'select * from player_equip where player_id=? and is_onarm = 1';
  }

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
 * Get an user's equip by playerId and serial id
 * @param {Number} playerId.
 * @param {Number} id id in player_equip
 * @returns {Object} player_equip obj
 */
playerEquipDao.getByEquipId = function(mysqlc, playerId, serialId, cb) {
	var selectSQL = 'select * from player_equip where player_id=? and id=?';
	var args = [playerId, serialId];

  console.log(selectSQL);
  console.log(args);

	mysqlc.query(selectSQL, args, function(err, res) {
		if(err) {
			utils.invokeCallback(cb, err, null);
			return;
		}
    else {
      console.log('in playerEquipDao.getByEquipId');
      console.log(res);
      if(!!res && res.length > 0) { //exists
        utils.invokeCallback(cb, null, res);
		  } else {
			  utils.invokeCallback(cb, null, []);
		  }
    }
	});
};

/**
 * Get an user's all equips by playerId
 * @param {String} mysqlc mysql client for Master DB or Slave DB
 * @param {Array} ids id in player_equip
 * @param {function} cb Callback function.
 */
playerEquipDao.getMulti = function(mysqlc, ids, cb) {
	var selectSQL = 'select * from player_equip where id in (?)';
	var args = [ids];

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
 * add equip
 * @param {String} mysqlc mysqlc client for Master DB or Slave DB
 * @param {Number} id serial number
 * @param {Number} playerId
 * @param {Number} equipId equip_id in equip_data
 * @param {Number} level
 * @param {function} cb Callback function.
 * @returns {object} true or false
 */
playerEquipDao.add = function(mysqlc, id, playerId, equipId, level, cb) {
  var insertSQL = 
    'insert into player_equip(id, player_id, equip_id, level, created_on, updated_on) values (?,?,?, ?, ?,?)';
  var createdOn = Math.round(new Date().getTime()/1000); //unixtime
  var args = [id, playerId, equipId, level, createdOn, createdOn];
  console.log(id, playerId, equipId, level, createdOn, createdOn);

  mysqlc.query(insertSQL, args, function(err, res) {
    if (err !== null) {
      utils.invokeCallback(cb, err, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        utils.invokeCallback(cb, null, res);
      }
      else {
        logger.error('add player_equip Failed!');
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};

/**
 * arm equip
 * @param {String} mysqlc mysqlc client for Master DB or Slave DB
 * @param {Number} id id in player_equip
 * @param {function} cb Callback function.
 * @returns {object} true or false
 */
playerEquipDao.arm = function(mysqlc, id, cb) {
  var updateSQL = 
    'update player_equip set is_onarm=1, updated_on=? where id=?';
  var updatedOn = Math.round(new Date().getTime()/1000); //unixtime
  var args = [updatedOn, id];
  console.log(id, updatedOn);

  mysqlc.query(updateSQL, args, function(err, res) {
    if (err !== null) {
      utils.invokeCallback(cb, err, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        utils.invokeCallback(cb, null, true);
      }
      else {
        logger.error('arm player_equip Failed!');
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};


/**
 * strongth equip
 * @param {String} mysqlc mysqlc client for Master DB or Slave DB
 * @param {Number} id id in player_equip
 * @param {Number} level
 * @param {function} cb Callback function.
 * @returns {object} true or false
 */
playerEquipDao.lvUp = function(mysqlc, id, level, cb) {
  var updateSQL = 
    'update player_equip set level=?, updated_on=? where id=?';
  var updatedOn = Math.round(new Date().getTime()/1000); //unixtime
  var args = [level, updatedOn, id];
  console.log(id, level, updatedOn);

  mysqlc.query(updateSQL, args, function(err, res) {
    if (err !== null) {
      utils.invokeCallback(cb, err, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        utils.invokeCallback(cb, null, true);
      }
      else {
        logger.error('lvup player_equip Failed!');
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};

playerEquipDao.delete = function(mysqlc, id, cb) {
  var deleteSQL = 'delete from player_equip where id=?';
  var args = [id];

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
        logger.error('delete player_equip Failed!' + id);
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};

/**
 * delete multi equips
 * @param {String} mysqlc mysqlc client for Master DB or Slave DB
 * @param {Array} ids id in player_equip
 * @param {function} cb Callback function.
 * @returns {object} true or false
 */
playerEquipDao.delMulti = function(mysqlc, ids, cb) {
  var deleteSQL = 'delete from player_equip where id in (?)';
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
        logger.error('delMulti player_equip Failed!' + id);
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};
