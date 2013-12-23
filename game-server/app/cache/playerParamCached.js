var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var playerParamDao = require('../dao/playerParamDao');
var MEMCONSTS = require('../../../shared/memConsts');

var util = require('util');
var utils = require('../util/utils');

var playerParamCached = module.exports;

function _makeKey(playerId) {
  return MEMCONSTS.PLAYERPARAM.KEY + '::' + playerId;
}

/**
 * @param {Object} HASH of playerParam
 */
function _makeValue(playerParam) {
  var value = JSON.stringify(playerParam);
  console.log('in _makeValue');
  console.log(value);
  return value;
}

/**
 * Get player param by playerId from memcached
 * @param {String} mcClient memcached client for Master or Slave
 * @param {String} cacheKey
 * @param {String} cacheValue
 * @param {Number} expiredOn in seconds
 * @param {function} cb Callback function.
 * @returns {object} playerData or null
 */
//playerParamCached.set = function(mcClient, cacheKey, cacheValue, expiredOn, cb) {
playerParamCached.set = function(mcClient, playerId, playerParam, cb) {
  var cacheKey = _makeKey(playerId);
  var cacheValue = _makeValue(playerParam);

  mcClient.set(cacheKey, cacheValue, expiredOn, function(err, res) {
		if(err) {
			utils.invokeCallback(cb, err.message, null);
			return;
		}
		if(!!res && res.length > 0) { //exists
      console.log(res);
			utils.invokeCallback(cb, null, true);
		} else {
			utils.invokeCallback(cb, null, false);
		}
	});
};

/**
 * Set player param by playerId into memcached
 * @param {String} mcClient memcached client for Master or Slave
 * @param {String} playerId
 * @param {function} cb Callback function
 * @returns {boolean} true or false
 */
playerParamCached.get = function(mcClient, playerId, cb) {
  // get from memcached first
  var cacheKey = _makeKey(playerId);
  mcClient.get(cacheKey, function(err, res) {
		if(err) {
			utils.invokeCallback(cb, err.message, null);
			return;
		}
		if(!!res && res.length > 0) { // hits
      console.log(res);
			utils.invokeCallback(cb, null, JSON.parse(res[0]));
		} else { 
			utils.invokeCallback(cb, null, null);
		}
	});
};
