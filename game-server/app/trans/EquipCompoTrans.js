var logger = require('pomelo-logger').getLogger(__filename);
var utils = require('../util/utils');
var worldPlayerDao = require('../dao/worldPlayerDao');
var playerEquipDao = require('../dao/playerEquipDao');
var playerFractionDao = require('../dao/playerFractionDao');
var playerParamDao = require('../dao/playerParamDao');
var playerItemDao = require('../dao/playerItemDao');
var playerEquipDao = require('../dao/playerEquipDao');

var async = require('async');
var equipConf = require('../../../shared/equipConf');
var gameInit = require('../../../shared/gameInit');
var commonUtils = require('../../../shared/util/commonUtils');
var dataApi = require('../util/dataApi');

var EquipCompoTrans = module.exports;

/**
 * Compose fraction into hero
 * @param {Object} mysqlc mysql client reference
 * @param {Number} playerId
 * @param {Number} star fraction star, also equip star
 * @param {Number} playerEquipId sequence id for id in player_equip
 * @param {Number} num how many fractions used for one compo
 * @param {Number} equipId equip_id in equip_data
 * @returns {Boolean} true or false
 */
EquipCompoTrans.exec = function(mysqlc, playerId, star, playerEquipId, num, equipId, cb) {
  console.log('in EquipCompoTrans');

  var type = gameInit.BAG.EQUIP.type; // type of fraction, here is "equip"
  var typeId = commonUtils.getInitID(gameInit.BAG, type);

  star = Number(star);
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
      setPlayerEquipId: function(callback) {
        playerEquipDao.add(mysqlc, playerEquipId, playerId, equipId, lv, callback);
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
            console.log('[EquipCompo] transaction query failed ');
            utils.invokeCallback(cb, err, null);
            return;
          }
          else {
            console.log('[EquipCompo] transaction query finished');
            //mysqlc.transRelease(); // TODO: test
            utils.invokeCallback(cb, null, res);
            return;
          }
        }
      });
    });
  });
};
