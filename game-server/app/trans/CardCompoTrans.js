var logger = require('pomelo-logger').getLogger(__filename);
var utils = require('../util/utils');
var worldPlayerDao = require('../dao/worldPlayerDao');
var playerEquipDao = require('../dao/playerEquipDao');
var playerFractionDao = require('../dao/playerFractionDao');
var playerParamDao = require('../dao/playerParamDao');
var playerItemDao = require('../dao/playerItemDao');
var playerCardDao = require('../dao/playerCardDao');

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

  star = Number(star);
  // compose fraction will get star level up one lv
  var alpha = cardConf.getAlpha(star+1);

  var maxLv = alpha.INITIAL_LV;
  var exp = 0;
  var lv  = 1;

  mysqlc.query('BEGIN', function(err, rows) { // start TRANSACTION
    if (err) {
      utils.invokeCallback(cb, err, null);
      return;
    }
    async.auto({
      // delete fraction
      deleteFraction: function(callback) {
        playerFractionDao.update(mysqlc, playerId, typeId, star, num, callback);
      },
      setPlayerCard: function(callback) {
        playerCardDao.add(mysqlc, playerCardId, playerId, cardId, exp, lv, maxLv, callback);
      }
    }, function(err, res) {
      var q; // query cmd
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
            utils.invokeCallback(cb, err, null);
            return;
          }
          else {
            console.log('[CardCompo] transaction query finished');
            //mysqlc.transRelease(); // TODO: test
            if (!res.deleteFraction || !res.setPlayerCard) {
              utils.invokeCallback(cb, null, false);
            }
            else {
              utils.invokeCallback(cb, null, true);
            }
          }
        }
      });
    });
  });
};
