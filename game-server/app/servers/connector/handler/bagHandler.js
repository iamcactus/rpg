/**
 * Module dependencies
 */
var logger = require('pomelo-logger').getLogger(__filename);
var async = require('async');

var dataApi = require('../../../util/dataApi');
var utils = require('../../../util/utils');
//var Bag = require('../../domain/bag'); // TODO: prepare bag object 
var bagAllData = require('../../../dao/union/bagAllData');
var BagSellTrans = require('../../../trans/BagSellTrans');

var gameInit = require('../../../../../shared/gameInit');
var CODE = require('../../../../../shared/code');
var commonUtils = require('../../../../../shared/util/commonUtils');

module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
  if (!this.app)
    logger.error(app);
};

var pro = Handler.prototype;

/**
 * Get bag datas including cards, equips, pets, skills, pets
 * Handle the request from client, and response result to client
 *
 * @param {Object} msg
 * @param {Object} session
 * @param {Function} next
 * @returns {Object} bag datas
 * @api public
 */
pro.getBag = function(msg, session, next) {
  var resValidation = commonUtils.validate('bag', msg);
	if(!resValidation) {
    console.log('bag resValidation fail');
		next(null, {code: CODE.ERR_WRONG_PARAM});
		return;
	}
  console.log('enter getBag');
  console.log(msg);

  // playerId should be checked with session
	var playerId = msg.playerId; // just for debug, playerId should be got from session
  var worldId = 1001; // just for debug, worldId shoule be got from session

  var typeId = commonUtils.getInitID(gameInit.BAG, msg.bagType);
  if (!typeId) {
	  next(null, {code: CODE.FAIL});
    return;
  }

  //var memcached = this.app.get('memcached');
  //var missionLog = {};

  var dbhandle_s = commonUtils.worldDBR(worldId);
  var mysqlc = this.app.get(dbhandle_s);
  var privateTop, publicTop;

  bagAllData.getByType(mysqlc, playerId, msg.bagType, function(err, res) {
    if (err) {
      logger.error('error with bagAllData.getByType: '  + ' err: ' + err);
	    next(null, {code: CODE.FAIL});
  	  return;
    }
    else {
      if (!!res) { // gets
        next(null, {code: 200, bag:res}); 
      }
      else {
        next(null, {code: 200});
      }
    }
  });
};

/**
 * Sell bag items including equips, skills, items
 * Handle the request from client, and response result to client
 *
 * @param {Object} msg
 * @param {Object} session
 * @param {Function} next
 * @returns {Boolean} true of false 
 * @api public
 */
pro.sell = function(msg, session, next) {
  var resValidation = commonUtils.validate('bagSell', msg);
	if(!resValidation) {
    console.log('bagSell resValidation fail');
		next(null, {code: CODE.ERR_WRONG_PARAM});
		return;
	}
  console.log('enter bagSell');

  // playerId should be checked with session
	var playerId = msg.playerId; // just for debug, playerId should be got from session
  var worldId = 1001; // just for debug, worldId shoule be got from session

  var typeId = commonUtils.getInitID(gameInit.BAG, msg.bagType);
  if (!typeId) {
	  next(null, {code: CODE.FAIL});
    return;
  }

  //var memcached = this.app.get('memcached');
  //var missionLog = {};

  var dbhandle_s = commonUtils.worldDBR(worldId);
  var mysqlPool = this.app.get(dbhandle_s);

  mysqlPool.acquire(function(err, client) {
    // first get data from Slave DB
    BagSellTrans.sell(client, msg.goods, playerId, typeId, function(err, res) {
      if (err) {
        logger.error('error with bagAllData.getByType: '  + ' err: ' + err);
  	    next(null, {code: CODE.FAIL});
        mysqlPool.release(client);
    	  return;
      }
      else {
        if (!!res) { // gets
          next(null, {code: 200}); 
        }
        else {
  	      next(null, {code: CODE.FAIL});
        }
        mysqlPool.release(client);
      }
    });
  });
};
