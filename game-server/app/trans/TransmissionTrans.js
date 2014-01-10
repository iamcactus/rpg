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

var TransmissionTrans = module.exports;

/**
 * Transmite exp from transfer to receiver
 * @param {Object} mysqlc mysql client reference
 * @param {Number} playerId
 * @param {Object} transferObj 
 * @param {Object} receiverObj
 * @param {Object} itemObj
 * @returns {Object} Transmission result
 */
TransmissionTrans.exec = function(mysqlc, playerId, transferObj, receiverObj, itemObj, cb) {
  console.log('in TransmissionTrans');

  mysqlc.query('BEGIN', function(err, rows) { // start TRANSACTION
    if (err) {
      utils.invokeCallback(cb, err, null);
      return;
    }
    async.auto({
      // delete fraction
      deleteItem: function(callback) {
        playerItemDao.update(mysqlc, itemObj.id, itemObj.num, callback);
      },
      resetTransfer: function(callback) {
        playerCardDao.update(mysqlc, transferObj.id, transferObj.exp, transferObj.lv, callback);
      },
      resetReceiver: function(callback) {
        playerCardDao.update(mysqlc, receiverObj.id, receiverObj.exp, receiverObj.lv, callback);
      }
    }, function(err, res) {
      var q; // query cmd
      if (err || !res || !res.deleteItem || !res.resetTransfer || !res.resetReceiver) {
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
            console.log('[Transmission] transaction query failed ');
            utils.invokeCallback(cb, err, null);
          }
          else {
            console.log('[Transmission] transaction query finished');
            //mysqlc.transRelease(); // TODO: test
            if (!res.deleteItem || !res.resetTransfer || !res.resetReceiver) {
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
