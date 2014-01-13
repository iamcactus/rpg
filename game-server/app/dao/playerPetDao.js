var logger = require('pomelo-logger').getLogger(__filename);
var utils = require('../util/utils');

var playerPetDao = module.exports;

/**
 * Get an user's all pets by playerId
 * @param {String} mysqlc mysql client for Master DB or Slave DB
 * @param {Number} playerId.
 * @param {function} cb Callback function.
 */
playerPetDao.get = function(mysqlc, playerId, isOnarm, cb) {
	var selectSQL = 'select * from player_pet where player_id=?';
	var args = [playerId];

  if (isOnarm === 1) {
	  selectSQL = 'select * from player_pet where player_id=? and is_onarm = 1';
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
 * Get an user's all pets by playerId
 * @param {String} mysqlc mysql client for Master DB or Slave DB
 * @param {Array} ids id in player_pet
 * @param {function} cb Callback function.
 */
playerPetDao.getMulti = function(mysqlc, ids, cb) {
	var selectSQL = 'select * from player_pet where id in (?)';
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

playerPetDao.add = function(
  mysqlc, id, playerId, petId, cb
) {
  var insertSQL = 
    'insert into player_pet(id, player_id, pet_id, created_on, updated_on) values (?,?,?, ?,?)';
  var createdOn = Math.round(new Date().getTime()/1000); //unixtime
  var args = [id, playerId, petId, createdOn, createdOn];
  console.log(id, playerId, petId, createdOn, createdOn);

  mysqlc.query(insertSQL, args, function(err, res) {
    if (err !== null) {
			utils.invokeCallback(cb, err, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        utils.invokeCallback(cb, null, res);
      }
      else {
        logger.error('add player_pet Failed!');
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};

playerPetDao.delete = function(mysqlc, id, cb) {
  var deleteSQL = 'delete from player_pet where id=?';
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
        logger.error('delete player_pet Failed!' + id);
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};

/**
 * delete multi pets
 * @param {String} mysqlc mysqlc client for Master DB or Slave DB
 * @param {Array} ids id in player_pet
 * @param {function} cb Callback function.
 * @returns {object} true or false
 */
playerPetDao.delMulti = function(mysqlc, ids, cb) {
  var deleteSQL = 'delete from player_pet where id in (?)';
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
        logger.error('deMulti player_equip Failed!' + id);
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};

/**
 * arm pet
 * @param {String} mysqlc mysqlc client for Master DB or Slave DB
 * @param {Number} id id in player_pet
 * @param {function} cb Callback function.
 * @returns {object} true or false
 */
playerPetDao.arm = function(mysqlc, id, cb) {
  var updateSQL = 
    'update player_pet set is_onarm=1, updated_on=? where id=?';
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
        logger.error('arm player_pet Failed!');
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};

playerPetDao.updateExp = function(mysqlc, id, exp, lv, cb) {
  var updateSQL = 
    'update player_pet set exp=?, level=?, updated_on=? where id=?';
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
        logger.error('update player_pet Failed!');
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};

playerPetDao.updateSkill = function(mysqlc, id,  positionId, petSkillId, cb) {

  var column = '';
  switch (positionId) {
    case 1:
      column = 'posi_skill1_id=?,';
      break;
    case 2:
      column = 'posi_skill2_id=?,';
      break;
    case 3:
      column = 'posi_skill3_id=?,';
      break;
    case 4:
      column = 'nega_skill1_id=?,';
      break;
    case 5:
      column = 'nega_skill2_id=?,';
      break;
    case 6:
      column = 'nega_skill3_id=?,';
      break;
  };

  var updateSQL = 
    'update player_pet set ' + column + ' updated_on=? where id=?';
  var updatedOn = Math.round(new Date().getTime()/1000); //unixtime
  var args = [petSkillId, updatedOn, id];

  mysqlc.query(updateSQL, args, function(err, res) {
    if (err !== null) {
      utils.invokeCallback(cb, err, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        utils.invokeCallback(cb, null, true);
      }
      else {
        logger.error('update player_pet skill Failed!');
        utils.invokeCallback(cb, null, false);
      }
    }
  });
};
