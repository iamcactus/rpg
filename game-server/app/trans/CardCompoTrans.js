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

var CardCompoTrans = module.exports;

/**
 * Compose fraction into hero
 * @param {Object} mysqlc mysql client reference
 * @param {Number} playerId
 * @param {Number} star fraction star, also card star
 * @param {Number} playerCardId sequence id for id in player_card
 * @param {Number} num how many fractions used for one compo
 * @param {Number} cardId card_id in card_data
 * @returns {Boolean} true or false
 */
CardCompoTrans.exec = function(mysqlc, playerId, star, playerCardId, num, cardId, cb) {
  var type = gameInit.BAG.CARD.type; // type of fraction, here is "general"
  var typeId = commonUtils.getInitID(gameInit.BAG, type);

  mysqlc.query('BEGIN', function(err, rows) { // start TRANSACTION
    if (err) {
      utils.invokeCallback(cb, err, null);
      return;
    }
    async.auto({
      // delete fraction
      deleteFraction: function(callback) {
        playerFractionDao.update(mysqlc, playerId, type, star, num, callback);
      },
      setPlayerCardId: ['newCard', function(callback, result) {
        var cardData = result.newCard;
        var alpha = cardConf.getAlpha(cardData.star);
        playerCardDao.add(mysqlc, playerCardId, playerId, cardId, 0, 1, alpha.INITIAL_LV, callback); // 0: exp, 1: level
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
            console.log('[CardCompo] transaction query failed ');
            console.log(err);
            utils.invokeCallback(cb, err, null);
            return;
          }
          else {
            console.log('[CardCompo] transaction query finished');
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
