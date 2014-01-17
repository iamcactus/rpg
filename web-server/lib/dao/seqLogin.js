/*
 * issue sequnce id for uid in login_data
 * 2013-2014
 * @iamcactus
 */ 
var logger = require('pomelo-logger').getLogger(__filename);

var seqLogin = module.exports;

seqLogin.getSequenceID = function(mysqlc, cb) {
  var sql = 'update seq_login set id=LAST_INSERT_ID(id+1)';

  // set mysql client with master
  mysqlc.query(sql, null, function(err, res) {
    if (err !== null) {
      cb(err, null);
    }
    else {
      if (!!res && res.affectedRows > 0 && res.insertId) {
        cb(null, res.insertId);
      }
      else {
        logger.error('getSequenceID for login_data FAILED!');
        cb(null, null);
      }
    }
  });
};

