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

var playerCardDao     = require('../../../dao/playerCardDao');
var playerItemDao     = require('../../../dao/playerItemDao');
var TransmissionTrans = require('../../../trans/TransmissionTrans');

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

var getMaterial = function(mysqlc, playerId, ids, itemId, cb) {
        console.log('--330--');
        console.log(playerId);
        console.log(ids);
        console.log(itemId);
  async.auto({
    playerCard: function(callback) {
      playerCardDao.getMulti(mysqlc, playerId, ids, function(err, res) {
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
    playerItem: function(callback) {
      playerItemDao.getByItemId(mysqlc, playerId, itemId, function(err, res) {
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
 * transmission exp from transferId to receiverId, costing ChuanGongDan of "normal/super"
 * Handle the request from client, and response result to client
 *
 * @param {Object} msg
 * @param {Object} session
 * @param {Function} next
 * @returns {Object} transmitted result
 * @api public
 */
pro.transmission = function(msg, session, next) {
  console.log(msg);

  var resValidation = commonUtils.validate('transmission', msg);
	if(!resValidation) {
    console.log('transmission resValidation fail');
		next(null, {code: CODE.ERR_WRONG_PARAM});
		return;
	}
  console.log('enter transmission');

  // playerId should be checked with session
	var playerId = msg.playerId; // just for debug, playerId should be got from session
  var worldId = 1001; // just for debug, worldId shoule be got from session
  var transType = msg.transType;  // 传功丹种类: ["normal", "super"]
  var transNum  = msg.transNum;   // 传功丹数量
  var transferId = msg.transferId;  //[传功者], id in player_card
  var receiverId = msg.receiverId;  //[收功者], id in player_card
  var transItemId;  // 传功丹 item_id
  var transConf = gameInit.TRANSMISSION; // local variable
  var ids = [transferId, receiverId];
  
  var typeId = commonUtils.getInitID(transConf, transType);
  console.log(typeId);

  if (!typeId) {
	  next(null, {code: CODE.FAIL});
    return;
  }
  else {
    if (typeId === transConf.NORMAL.id) {
      transItemId = transConf.NORMAL.ITEMID;
    }
    else if (typeId === transConf.NORMAL.id) {
      transItemId = transConf.SUPER.ITEMID;
    }
  }

  // db handle
  var dbhandle_m = commonUtils.worldDBW(worldId);
  var mysqlPool = this.app.get(dbhandle_m);

  var dbhandle_s = commonUtils.worldDBR(worldId);
  var mysqlPool_s = this.app.get(dbhandle_s);

        console.log('--351--');
        console.log(mysqlPool);


  // TODO: refactoring
  async.auto({
    collection: function(callback) {
      getMaterial(mysqlPool_s, playerId, ids, transItemId, function(err, res) {
        console.log('--301--');
        console.log(res);
        if (!!res.playerCard && !!res.playerItem) {
          var cObj = res.playerCard;
          var iObj = res.playerItem;
          var t = {}; // transfer
          var r = {}; // receiver
          if (cObj[0].id == transferId) {
            t = cObj[0];
            r = cObj[1];
          }
          else {
            r = cObj[0];
            t = cObj[1];
          }

          // verify, transfer lv > 1, has transNum of transItemId
          var addOnExp    = formula.transmission(typeId, transNum, t.exp);
          var receiverLv  = formula.cardLevelUp(r.exp, addOnExp, r.level, r.max_level);
          var receiverExp = r.exp + addOnExp;
        console.log('--300--');
        console.log(addOnExp);
        console.log(receiverLv);
        console.log(receiverExp);
          
          transNum = 0 - (Number(transNum));
          // callback material data
          var obj = {
            transfer: {
              id:   t.id,
              exp:  0,    // transmit all exp by now 
              lv:   1     // reset into level 1
            },
            receiver: {
              id:   r.id,
              exp:  receiverExp,
              lv:   receiverLv
            },
            item: {
              id:   iObj[0].id,
              num:  transNum
            }
          };

        console.log('--302--');
        console.log(obj);
          callback(err, obj);
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
        // first do calculate
        var temp = result.collection;
        // second do transaction: delete item, reset transfer and reset receiver
        mysqlPool.acquire(function(err, client) {
          TransmissionTrans.exec(client, playerId, temp.transfer, temp.receiver, temp.item, function(err, res) {
            if (!!err || !!res) {
              mysqlPool.release(client);
            }
            callback(err, res);
          });
        }); // end of mysqlPool.acquire
      } // end of if (!!results.calculation)
      else {
        callback({code: CODE.TRANSMISSION.ERR_MATERIAL}, null);
      }
    }] // end of decompoTrans
  }, function(err, res) {
    if (err) {
      logger.error('pro.decompo: '  + ' err');
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
            receiverId:   res.collection.receiver.id,   //  [收功者]
            receivedExp:  res.collection.receiver.exp,  //  获得了[xxxx]经验
            receiverLv:   res.collection.receiver.lv    //  收功者的等级数字
          }
        }); 
      }
      else {
        next(null, {code: CODE.FAIL});
      }
    }
  });
};
