/**
 * Module dependencies
 */
var logger = require('pomelo-logger').getLogger(__filename);
var async = require('async');

var dataApi = require('../../../util/dataApi');
var utils = require('../../../util/utils');
//var Player = require('../../domain/player'); // TODO: prepare bag object 
var bagAllData = require('../../../dao/union/bagAllData');
/*
var playerParamDao = require('../../../playerParamDao');
var playerCardDao = require('../playerCardDao');
var playerUnitDao = require('../playerUnitDao');
var playerEquipDao = require('../playerEquipDao');
var playerPetDao = require('../playerPetDao');
var playerSkillDao = require('../playerSkillDao');
var unitMeridianDao = require('../unitMeridianDao');
*/
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

  // playerId should be checked with session
	var playerId = msg.playerId; // just for debug, playerId should be got from session
  var worldId = 1001; // just for debug, worldId shoule be got from session

  var typeId = commonUtils.getInitID(gameInit.BAG, msg.type);
  if (!typeId) {
	  next(null, {code: CODE.FAIL, error:err});
  }

  //var memcached = this.app.get('memcached');
  //var missionLog = {};

  var dbhandle_s = commonUtils.worldDBR(worldId);
  var mysqlc = this.app.get(dbhandle_s);

  // first get data from Slave DB
  bagAllData.getByType(mysqlc, playerId, typeId, function(err, res) {
    if (err) {
      logger.error('error with bagAllData.getByType: '  + ' err: ' + err);
	    next(null, {code: CODE.FAIL, error:err});
  	  return;
    }
    else {
      if (!!res) { // gets
        next(null, {code: 200, bag:res}); 
      }
    }
  });
};
