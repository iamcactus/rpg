var logger = require('pomelo-logger').getLogger(__filename);
var utils = require('../util/utils');
var worldPlayerDao = require('../dao/worldPlayerDao');

var worldPlayerTrans = module.exports;

worldPlayerTrans.createWorldPlayer = function(mysqlc, uid, worldId, playerId, cb) {
  mysqlc.query('BEGIN', function(err, rows) { // start TRANSACTION
    if (err) {
      utils.invokeCallback(cb, err, null);
      return;
    }
    worldPlayerDao.createWorldPlayer(mysqlc, uid, worldId, playerId, function(err, res) {
      var q; // query cmd
      if (err) {
        q = 'ROLLBACK';
        console.log('[createWorldPlayer] transaction query failed ');
        console.log(err);
      }
      else {
        q = 'COMMIT';
      }
      mysqlc.query(q, function(err1, res1) {
        if (err1) {
          utils.invokeCallback(cb, err1, null);
          return;
        }
        else {
          if (err) {
            utils.invokeCallback(cb, err, null);
            return;
          }
          else {
            if (!!res) {
              console.log('[createWorldPlayer] transaction finished ');
              utils.invokeCallback(cb, null, true);
            }
            else {
              utils.invokeCallback(cb, null, false);
            }
          }
        }
      });
    });
  });
};

