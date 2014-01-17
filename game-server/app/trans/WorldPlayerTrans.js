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
      mysqlc.query(q, function(err, res1) {
        if (err) {
          utils.invokeCallback(cb, err, null);
          return;
        }
        else {
          console.log('[createWorldPlayer] transaction finished ');
          console.log(res);
          mysqlc.end(); // TODO: test
          utils.invokeCallback(cb, null, res);
          return;
        }
      });
    });
  });
}

