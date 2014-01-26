var logger = require('pomelo-logger').getLogger(__filename);
var utils = require('../util/utils');

var playerSkillDao = module.exports;

/**
 * Get an user's all skills by playerId
 * @param {String} mysqlc mysql client for Master DB or Slave DB
 * @param {Number} playerId.
 * @param {Number} isOnarm 1:on, 0:off
 * @param {function} cb Callback function.
 */
playerSkillDao.get = function(mysqlc, playerId, isOnarm, cb) {
	var selectSQL = 'select * from player_skill where player_id=?';
	var args = [playerId];

  if (isOnarm === 1) {
	  selectSQL = 'select * from player_skill where player_id=? and is_onarm = 1';
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
 * Get an user's skill by playerId and serial id
 * @param {Number} playerId.
 * @param {Number} id id player_skill
 * @returns {Object} player_skill obj
 */
playerSkillDao.getById = function(mysqlc, playerId, serialId, cb) {
	var selectSQL = 'select * from player_skill where player_id=? and id=?';
	var args = [playerId, serialId];

	mysqlc.query(selectSQL, args, function(err, res) {
		if(err) {
			utils.invokeCallback(cb, err, null);
			return;
		}
    else {
      console.log('in playerSkillDao.getById');
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
 * Get an user's all skills by playerId
 * @param {String} mysqlc mysql client for Master DB or Slave DB
 * @param {Array} ids id in player_skill
 * @param {function} cb Callback function.
 */
playerSkillDao.getMulti = function(mysqlc, ids, cb) {
	var selectSQL = 'select * from player_skill where id in (?)';
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
 * add skill
 * @param {String} mysqlc mysqlc client for Master DB or Slave DB
 * @param {Number} id serial number
 * @param {Number} playerId
 * @param {Number} skillId skill_id in skill_data
 * @param {Number} exp
 * @param {Number} level
 * @param {function} cb Callback function.
 * @returns {object} true or false
 */
playerSkillDao.add = function(mysqlc, id, playerId, skillId, exp, level, cb) {
  var insertSQL = 
    'insert into player_skill(id, player_id, skill_id, exp, level, created_on, updated_on) values (?,?,?, ?,?, ?,?)';
  var createdOn = Math.round(new Date().getTime()/1000); //unixtime
  var args = [id, playerId, skillId, exp, level, createdOn, createdOn];
  console.log(id, playerId, skillId, exp, level, createdOn, createdOn);

  mysqlc.query(insertSQL, args, function(err, res) {
    if (err !== null) {
      cb({code: err.number, msg: err.message}, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        utils.invokeCallback(cb, null, res);
      }
      else {
        logger.error('add player_skill Failed!');
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};

/**
 * arm skill
 * @param {String} mysqlc mysqlc client for Master DB or Slave DB
 * @param {Number} id id in player_skill
 * @param {function} cb Callback function.
 * @returns {object} true or false
 */
playerSkillDao.arm = function(mysqlc, id, cb) {
  var updateSQL = 
    'update player_skill set is_onarm=1, updated_on=? where id=?';
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
        logger.error('arm player_skill Failed!');
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};

/**
 * strongth skill
 * @param {String} mysqlc mysqlc client for Master DB or Slave DB
 * @param {Number} id id in player_skill
 * @param {Number} exp
 * @param {Number} level
 * @param {function} cb Callback function.
 * @returns {object} true or false
 */
playerSkillDao.lvUp = function(mysqlc, id, exp, level, cb) {
  var updateSQL = 
    'update player_skill set exp=?, level=?, updated_on=? where id=?';
  var updatedOn = Math.round(new Date().getTime()/1000); //unixtime
  var args = [exp, level, updatedOn, id];
  console.log(id, exp, level, updatedOn);

  mysqlc.query(updateSQL, args, function(err, res) {
    if (err !== null) {
      utils.invokeCallback(cb, err, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        utils.invokeCallback(cb, null, true);
      }
      else {
        logger.error('lvup player_skill Failed!');
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};

playerSkillDao.delete = function(mysqlc, id, cb) {
  var deleteSQL = 'delete from player_skill where id=?';
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
        logger.error('delete player_skill Failed!' + id);
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};

/**
 * delete multi skills
 * @param {String} mysqlc mysqlc client for Master DB or Slave DB
 * @param {Array} ids id in player_skill
 * @param {function} cb Callback function.
 * @returns {object} true or false
 */
playerSkillDao.delMulti = function(mysqlc, ids, cb) {
  var deleteSQL = 'delete from player_skill where id in (?)';
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
        logger.error('delMulti player_skill Failed!' + id);
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};
