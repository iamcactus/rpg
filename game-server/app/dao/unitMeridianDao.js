var logger = require('pomelo-logger').getLogger(__filename);
var GAMEINIT = require('../../../shared/gameInit');
var utils = require('../util/utils');
var dataApi = require('../util/dataApi');

var unitMeridianDao = module.exports;

/**
 * Get unitMeridian data by playerCardId
 * @param {String} mysqlc mysqlc client for Master DB or Slave DB
 * @param {Number} playerCardId.
 * @param {function} cb Callback function.
 * @returns {object} unitMeridian or null
 */
unitMeridianDao.get = function(mysqlc, playerCardId, cb) {
	var selectSQL = 'select * from unit_meridian where player_card_id=?';
	var args = [playerCardId];

	mysqlc.query(selectSQL,args,function(err, res) {
		if(err) {
			utils.invokeCallback(cb, err, null);
			return;
		}
		if(!!res && res.length > 0) { //exists
			utils.invokeCallback(cb, null, res);
		} else {
			utils.invokeCallback(cb, null, null); // the last "null" make sure "if(player)" be failed
		}
	});
};

/**
 * Get unitMeridian data by playerCardId
 * @param {String} mysqlc mysqlc client for Master DB or Slave DB
 * @param {Array} ids id in player_card.
 * @param {function} cb Callback function.
 * @returns {object} unitMeridian or null
 */
unitMeridianDao.getMulti = function(mysqlc, ids, cb) {
	var selectSQL = 'select * from unit_meridian where player_card_id in (?)';
	var args = [ids];
  console.log(ids);
  console.log(selectSQL);
	mysqlc.query(selectSQL,args,function(err, res) {
		if(err) {
			utils.invokeCallback(cb, err, null);
			return;
		}
		if(!!res && res.length > 0) { //exists
			utils.invokeCallback(cb, null, res);
		} else {
			utils.invokeCallback(cb, null, null);
		}
	});
};

/**
 * Initiallize unitMeridian by setting default stoneId into the positionId
 * @param {String} mysqlc mysqlc client for Master DB or Slave DB
 * @param {Number} playerCardId
 * @param {Number} positionId
 * @param {function} cb Callback function.
 * @returns {boolean}  true or false
 */
unitMeridianDao.init = function(mysqlc, playerCardId, positionId, cb) {
  var insertSQL = 
    'insert into unit_meridian(player_card_id, position_id, stone_id, created_on, updated_on) values (?,?,?, ?,?)';
  var createdOn = Math.round(new Date().getTime()/1000); //unixtime
  var updatedOn = createdOn;
  var args = [playerCardId, positionId, 
              GAMEINIT.STONE_INIT.ID,
              createdOn, updatedOn
              ];
  console.log('unitMeridianDao.init:' +playerCardId + ':' + positionId + ':' + updatedOn);
  mysqlc.query(insertSQL, args, function(err, res) {
    if (err !== null) {
			utils.invokeCallback(cb, err, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        console.log(res);
        utils.invokeCallback(cb, null, res);
      }
      else {
        logger.error('unitMeridianDao.init Failed!');
        utils.invokeCallback(cb, null, null);
      }
    }
  });
};

/**
 * update unitMeridianDao
 * @param {String} mysqlc mysqlc client for Master DB or Slave DB
 * @param {String} params, HASH for updated target colums
 * @param {function} cb Callback function.
 * @returns {object} true or false
 */
unitMeridianDao.update = function(mysqlc, playerCardId, positionId, stoneId, cb) {
  var updatedOn = Math.round(new Date().getTime()/1000); //unixtime
  var updateSQL = 'update unit_meridian set stone_id=?, updated_on=? where player_card_id=? and position_id=?';

  var args = [stoneId, updatedOn, playerCardId, positionId];
  mysqlc.query(updateSQL, args, function(err, res) {
    if (err !== null) {
			utils.invokeCallback(cb, err, null);
    }
    else {
      if (!!res && res.affectedRows > 0) {
        console.log(res);
        utils.invokeCallback(cb, null, true);
      }
      else {
        logger.error('initPlayerParam Failed!');
        utils.invokeCallback(cb, null, false);
      }
    }
  });

};
