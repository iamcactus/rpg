var logger = require('pomelo-logger').getLogger(__filename);
var utils = require('../util/utils');
var playerCardDao = require('../dao/playerCardDao');
var playerUnitDao = require('../dao/playerUnitDao');

var async = require('async');

var CardOnUnit = module.exports;

/**
 * set card into unit
 * @param {Object} mysqlc mysql client reference
 * @param {Number} playerId
 * @param {Number} positionId position_id in player_unit
 * @param {Number} id id in player_card
 * @returns {Boolean}
 */
CardOnUnit.exec = function(mysqlc, playerId, positionId, id, cb) {
  console.log('in CardOnUnit');

  mysqlc.query('BEGIN', function(err, rows) { // start TRANSACTION
    if (err) {
      utils.invokeCallback(cb, err, null);
      return;
    }
    async.auto({
      onUnit:  function(callback) {
        playerUnitDao.add(mysqlc, playerId, positionId, id, callback);
      },
      onarm: function(callback) {
        playerCardDao.arm(mysqlc, id, callback);
      }
    }, function(err, res) {
      var q; // query cmd
      if (err || !res || !res.onarm || !res.onUnit) {
        q = 'ROLLBACK';
      }
      else {
        q = 'COMMIT';
      }
      mysqlc.query(q, function(err1, res1) {
        if (err1) {
          utils.invokeCallback(cb, err1, null);
        }
        else {
          if (err) {
            console.log('[CardStrengthen] transaction query failed ');
            utils.invokeCallback(cb, err, null);
          }
          else {
            console.log('[CardStrengthen] transaction query finished');
            if (!res.onarm || !res.onUnit) {
              utils.invokeCallback(cb, null, false);
            }
            else {
              utils.invokeCallback(cb, null, true);
            }
          }
        }
      }); // end of mysqlc.query
    }); // end of async.auto
  }); // mysqlc.query('BEGIN'
};
