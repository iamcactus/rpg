/**
 * Module dependencies
 */
var dataApi = require('../../../util/dataApi');
var logger = require('pomelo-logger').getLogger(__filename);
var _ = require('underscore');
var async = require('async');

var CODE = require('../../../../../shared/code');
var commonUtils = require('../../../../../shared/util/commonUtils');
var battleAllData = require('../../../dao/union/battleAllData');

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
 * Get battle report
 * Handle the request from client, and response result to client
 *
 * @param {Object} msg
 * @param {Object} session
 * @param {Function} next
 * @returns {Object} battle report or null
 * @api public
 */
pro.battleBegin = function(msg, session, next) {
  var resValidation = commonUtils.validate('battle', msg);
	if(!resValidation) {
    console.log('resValidation fail');
		next(null, {code: CODE.ERR_WRONG_PARAM});
		return;
	}
  console.log('enter arenaHandler.battle');

  // playerId should be checked with session
	var playerId = msg.playerId; // just for debug, playerId should be got from session
  var attackeeId = msg.attackeeId;

  playerId    = 2015;
  attackeeId  = 2020;
  var worldId = 1001; // just for debug, should be get throud session
  var dbhandle_s = commonUtils.worldDBR(worldId);
  var mysqlc = this.app.get(dbhandle_s);

  var bid = 10001; // reference to the battle report

  battleAllData.calc(mysqlc, playerId, attackeeId, function(err, res) {
    if (err) {
      logger.error('error with arenaHandler: ');
      logger.error(err);
	    next(null, {code: CODE.FAIL, error:err});
    }
    else {
      next(null, {code: 200, bid: bid, report:res}); 
    }
  });
};

/**
 * Get battle report
 * Handle the request from client, and response result to client
 *
 * @param {Object} msg
 * @param {Object} session
 * @param {Function} next
 * @returns {Object} battle report or null
 * @api public
 */
pro.battleEnd = function(msg, session, next) {
/*
  var resValidation = commonUtils.validate('battleEnd', msg);
	if(!resValidation) {
    console.log('resValidation fail');
		next(null, {code: CODE.ERR_WRONG_PARAM});
		return;
	}
*/
  console.log('enter arenaHandler.battleEnd');

  // playerId should be checked with session
	var playerId = msg.playerId; // just for debug, playerId should be got from session
  var battleId = msg.bid; // reference to the battle report

  playerId    = 2015;
  var attackeeId  = 2020;
  var worldId = 1001; // just for debug, should be get throud session
  var dbhandle_s = commonUtils.worldDBR(worldId);
  var mysqlc = this.app.get(dbhandle_s);

  battleAllData.calc(mysqlc, playerId, attackeeId, function(err, res) {
    if (err) {
      logger.error('error with arenaHandler: ');
      logger.error(err);
	    next(null, {code: CODE.FAIL, error:err});
    }
    else {
      var result = {
        cards: [1311, 1325],
        items: [8001, 8002],
        playerParam: {
          exp:  100,
          level: 2,
          gold: 100,
          silver: 1000
        }
      }
      next(null, {code: 200, result: result}); 
    }
  });
};
