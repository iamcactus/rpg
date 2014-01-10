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

var EquipStrengthenTrans = module.exports;

/**
 * Strengthen equip using silver
 * @param {Object} mysqlc mysql client reference
 * @param {Number} playerId
 * @param {Object} playerParamObj silver num
 * @param {Object} equipObj equip id and equip lv
 * @returns {Object} EquipStrengthen result
 */
EquipStrengthenTrans.exec = function(mysqlc, playerId, playerParamObj, equipObj, cb) {
  console.log('in EquipStrengthenTrans');

  mysqlc.query('BEGIN', function(err, rows) { // start TRANSACTION
    if (err) {
      utils.invokeCallback(cb, err, null);
      return;
    }
    async.auto({
      // delete fraction
      deleteCost: function(callback) {
        playerParamDao.update(mysqlc, playerParamObj, playerId, callback);
      },
      lvUpEquip: function(callback) {
        playerEquipDao.lvUp(mysqlc, equipObj.id, equipObj.lv, callback);
      }
    }, function(err, res) {
      var q; // query cmd
      if (err || !res || !res.deleteCost || !res.lvUpEquip) {
        q = 'ROLLBACK';
      }
      else {
        q = 'COMMIT';
      }
      mysqlc.query(q, function(err1, res1) {
        //mysqlc.transRelease(); // TODO: test
        if (err1) {
          utils.invokeCallback(cb, err1, null);
        }
        else {
          console.log('---361---');
          console.log(err);
          console.log(res);
          if (err) {
            console.log('[EquipStrengthen] transaction query failed ');
            utils.invokeCallback(cb, err, null);
          }
          else {
            console.log('[EquipStrengthen] transaction query finished');
            //mysqlc.transRelease(); // TODO: test
            if (!res.deleteCost || !res.lvUpEquip) {
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
