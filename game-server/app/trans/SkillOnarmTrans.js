var logger = require('pomelo-logger').getLogger(__filename);
var utils = require('../util/utils');
var playerSkillDao = require('../dao/playerSkillDao');
var playerUnitDao = require('../dao/playerUnitDao');

var async = require('async');

var SkillOnarm = module.exports;

/**
 * arm equip
 * @param {Object} mysqlc mysql client reference
 * @param {Number} playerId
 * @param {Number} positionId position_id in player_unit
 * @param {Number} armPosition short for skill1|skill2
 * @param {Number} id id in player_skill
 * @returns {Boolean}
 */
SkillOnarm.exec = function(mysqlc, playerId, positionId, armPosition, id, cb) {
  console.log('in SkillOnarm');

  mysqlc.query('BEGIN', function(err, rows) { // start TRANSACTION
    if (err) {
      utils.invokeCallback(cb, err, null);
      return;
    }
    async.auto({
      setUnit:  function(callback) {
        playerUnitDao.arm(mysqlc, playerId, positionId, armPosition, id, callback);
      },
      onarm: function(callback) {
        playerSkillDao.arm(mysqlc, id, callback);
      }
    }, function(err, res) {
      var q; // query cmd
      if (err || !res || !res.onarm || !res.setUnit) {
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
            console.log('[SkillStrengthen] transaction query failed ');
            utils.invokeCallback(cb, err, null);
          }
          else {
            console.log('[SkillStrengthen] transaction query finished');
            if (!res.onarm || !res.setUnit) {
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
