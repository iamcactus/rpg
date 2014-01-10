/**
 * Module dependencies
 */
var logger = require('pomelo-logger').getLogger(__filename);
var async = require('async');
var _ = require('underscore');

var dataApi = require('../../../util/dataApi');
var utils = require('../../../util/utils');
//var Bag = require('../../domain/bag'); // TODO: prepare bag object 
var bagAllData = require('../../../dao/union/bagAllData');

var playerEquipDao     = require('../../../dao/playerEquipDao');
var playerParamDao     = require('../../../dao/playerParamDao');
var EquipStrengthenTrans = require('../../../trans/EquipStrengthenTrans');

var gameInit    = require('../../../../../shared/gameInit');
var CODE        = require('../../../../../shared/code');
var commonUtils = require('../../../../../shared/util/commonUtils');
var drawPrize   = require('../../../util/drawPrize');
var formula     = require('../../../../app/util/formula');

module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
  if (!this.app)
    logger.error(app);
};

var pro = Handler.prototype;

// ids: [transferId, receiverId]

var getMaterial = function(mysqlc, playerId, serialId, cb) {
        console.log('--330--');
        console.log(playerId);
  async.auto({
    playerParam: function(callback) {
      playerParamDao.get(mysqlc, playerId, function(err, res) {
        console.log('--331--');
        console.log(res);
        if (!!res) {
          callback(null, res);
        }
        else if (!!err) {
          callback(err, null);
        }
        else {
          callback({code: CODE.FAIL}, null);
        }
      });
    },
    playerEquip: function(callback) {
      playerEquipDao.getByEquipId(mysqlc, playerId, serialId, function(err, res) {
        console.log('--332--');
        console.log(res);
        if (!!res && res.length) {
          callback(null, res);
        }
        else if (!!err) {
          callback(err, null);
        }
        else {
          callback({code: CODE.FAIL}, null);
        }
      });
    }
  }, function(err, result) {
    if (!!err) {
       cb(err, null);
    }
    else if (!!result) {
      cb(null, result);
    }
    else {
      cb(null, null);
    }
  });
};

/**
 * Level up equip using silver
 * Handle the request from client, and response result to client
 *
 * @param {Object} msg
 * @param {Object} session
 * @param {Function} next
 * @returns {Object} strengthen result
 * @api public
 */
pro.equipStrengthen = function(msg, session, next) {
  console.log(msg);

  var resValidation = commonUtils.validate('equipStrengthen', msg);
	if(!resValidation) {
    console.log('equipStrengthen resValidation fail');
		next(null, {code: CODE.ERR_WRONG_PARAM});
		return;
	}
  console.log('enter equipStrengthen');

  // playerId should be checked with session
	var playerId = msg.playerId; // just for debug, playerId should be got from session
  var worldId = 1001; // just for debug, worldId shoule be got from session

  var serialId   = msg.equipId;  // id in player_equip
  var targetLv  = msg.targetLevel;  // target level to be up
  var transConf = gameInit.TRANSMISSION; // local variable
  
  // db handle
  var dbhandle_m = commonUtils.worldDBW(worldId);
  var mysqlPool = this.app.get(dbhandle_m);

  var dbhandle_s = commonUtils.worldDBR(worldId);
  var mysqlPool_s = this.app.get(dbhandle_s);

  // TODO: refactoring
  async.auto({
    collection: function(callback) {
      getMaterial(mysqlPool_s, playerId, serialId, function(err, res) {
        console.log('--301--');
        console.log(res);
        if (!!res.playerParam && !!res.playerEquip) {
          var pObj = res.playerParam; // local variable
          var eObj = res.playerEquip[0];

          console.log(pObj);
          console.log(eObj);
          // verify, transfer lv > 1, has transNum of transItemId
          var equipObj = dataApi.equip.findBy('equip_id', eObj.equip_id);
          console.log(equipObj);
          var cost = formula.equipLvUpCost(eObj.level, targetLv, equipObj.star);
          var left = pObj.silver - cost;
          console.log(serialId);
          console.log(targetLv);
          console.log(cost);
          if (cost <= 0 || left < 0) {
            callback({code: CODE.STRENGTHEN.ERR_MATERIAL}, null);  
          }
          else {
            // callback material data
            var obj = {
              param: {
                silver: pObj.silver - cost
              },
              equip: {
                id: eObj.id,
                lv: targetLv,
                cost: cost
              }
            };
            console.log('--302--');
            console.log(obj);
            callback(err, obj);
          }
        }
        else {
          callback(err, null);
        }
      });
    },
    transaction: ['collection', function(callback, result) {
        console.log('--313--');
        console.log(result);
      if (!!result.collection) {
        var temp = result.collection;
        // second do transaction: reduce silver, lvUp equip
        mysqlPool.acquire(function(err, client) {
          EquipStrengthenTrans.exec(client, playerId, temp.param, temp.equip, function(err, res) {
            if (!!err || !!res) {
              mysqlPool.release(client);
            }
            callback(err, res);
          });
        }); // end of mysqlPool.acquire
      } // end of if (!!results.calculation)
      else {
        callback({code: CODE.STRENGTHEN.ERR_MATERIAL}, null);
      }
    }] // end of decompoTrans
  }, function(err, res) {
    if (err) {
      logger.error('pro.equipStrengthen: '  + ' err');
      logger.error(err);
      var code = CODE.FAIL;
      if (err.code) {
        code = err.code;
      }
      next(null, {code: code});
    }
    else {
        console.log('--320--');
        console.log(res);
      if (!!res && !!res.transaction) { // gets
        next(null, {
          code: 200, 
          data: {
            equipId:  res.collection.equip.id,   //  装备
            level:    res.collection.equip.lv,   //  等级
            cost:     res.collection.equip.cost
          }
        }); 
      }
      else {
        next(null, {code: CODE.FAIL});
      }
    }
  });
};
