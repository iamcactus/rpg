var logger = require('pomelo-logger').getLogger(__filename);
var utils = require('../util/utils');
var seqPlayerEquip = module.exports;

seqPlayerEquip.getSequenceID = function(mysqlc, cb) {
  var sql = 'update seq_player_equip set id=LAST_INSERT_ID(id+1)';

  // set mysql client with master
  mysqlc.query(sql, null, function(err, res) {
    if (err !== null) {
      utils.invokeCallback(cb, err, null);
    }
    else {
      if (!!res && res.affectedRows > 0 && res.insertId) {
        utils.invokeCallback(cb, null, res.insertId);
      }
      else {
        logger.error('getSequenceID of player_equip FAILER!');
        utils.invokeCallback(cb, null, null);
      }
    }
  });
} ;

