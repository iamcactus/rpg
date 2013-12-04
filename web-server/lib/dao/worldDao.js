var mysql = require('./mysql/mysql');

/*
var mysqlc_m = 'game_master_m';
var mysqlc_s = 'game_master_s';
var mysql_m = mysql.init(mysqlc_m);
var mysql_s = mysql.init(mysqlc_s);
console.log('in worldDao');
console.log(mysql_m);
console.log(mysql_s);
*/

var worldDao = module.exports;

/**
 * Get worldData
 * @param {String} mysqlc handle for Master DB or Slave DB
 * @param {function} cb
 * @returns {Object} worldData or null
 */
worldDao.getWorldList = function (mysqlc, cb) {
  var selectSQL = 'select * from world_data'; 

  mysqlc.query(selectSQL, null, function(err, res) {
    if (err !== null) {
      cb(err.message, null);
    }
    else {
      if (!!res && res.length > 0) {
        cb(null, res);
      }
      else {
        cb(null, null);
      }
    }
  });
};
