var logger = require('pomelo-logger').getLogger(__filename);
var utils = require('../util/utils');
var worldPlayerDao = require('../dao/worldPlayerDao');
var playerEquipDao = require('../dao/playerEquipDao');
var playerFractionDao = require('../dao/playerFractionDao');
var playerParamDao = require('../dao/playerParamDao');
var playerItemDao = require('../dao/playerItemDao');
var playerCardDao = require('../dao/playerCardDao');
var seqPlayerCard = require('../dao/seqPlayerCard');

var async = require('async');
var cardConf = require('../../../shared/cardConf');
var gameInit = require('../../../shared/gameInit');
var commonUtils = require('../../../shared/util/commonUtils');
var dataApi = require('../util/dataApi');

var CardDecompoTrans = module.exports;

CardDecompoTrans.exec = function(mysqlc, params, playerId, star, num, cb) {
  console.log(params);
  var playerCardId; // serial id in player_card
  var cardId;       // card_id in card_data
  var typeId = commonUtils.getInitID(gameInit.BAG, "general"); 

  var ids = [];
  for (var i in params) {
    ids.push(params[i].id);
  }

  console.log(ids);

  mysqlc.query('BEGIN', function(err, rows) { // start TRANSACTION
    if (err) {
      utils.invokeCallback(cb, err, null);
      return;
    }
    async.auto({
    /*
      // generate a new playerCardId 
      newPlayerCardId: function(callback) {
        seqPlayerCard.getSequenceID(mysqlc_master, function(err, id1) {
          if (err) {
          	logger.error('[register] fail to get playerCardId for ' + err.stack);
        	  next(null, {code: CODE.FAIL, error:err});
        		return;
          }
          else {
            playerCardId = id1;
            console.log(id1 + ' is generated as newPlayerCardId');
            callback(null, id1);
          }
        });
      },
      newCard: function(callback) {
        // TODO: generate card function
        cardId = 1229;
        callback(null, cardId);
      },
      setPlayerCardId: function(callback) {
        var cardData = dataApi.card.findBy('card_id', cardId);
        var alpha = cardConf.getAlpha(cardData.star);
        playerCardDao.add(mysqlc, playerCardId, playerId, cardId, 0, 1, alpha.INITIAL_LV, callback);
      },
    */
    /*
      // get fraction
      getFraction: function(callbac) {
        playerFractionDao.getByType(mysqlc, playerId, typeId, callback);
      },
      */
      // set fraction
      addFraction: function(callback) {
        playerFractionDao.replace(mysqlc, playerId, typeId, star, num, callback);
      },
      // delete card
      deleteItem: ['addFraction', function(callback, result) {
        if (!!result.addFraction) {
          playerCardDao.delMulti(mysqlc, ids, callback);
        }
        else {
          callback(err, null);
        }
      }]
    }, function(err, res) {
      var q; // query cmd
      console.log('-----111-----');
      console.log(res);
      if (err || !res) {
        q = 'ROLLBACK';
      }
      else {
        q = 'COMMIT';
      }
      mysqlc.query(q, function(err1, res1) {
        //mysqlc.transRelease(); // TODO: test
        if (err1) {
          utils.invokeCallback(cb, err1, null);
          return;
        }
        else {
          if (err) {
            console.log('[CardDecompo] transaction query failed ');
            console.log(err);
            utils.invokeCallback(cb, err, null);
            return;
          }
          else {
            console.log('[CardDecompo] transaction query finished');
            console.log(res);
            //mysqlc.transRelease(); // TODO: test
            utils.invokeCallback(cb, null, res);
            return;
          }
        }
      });
    });
  });
};
