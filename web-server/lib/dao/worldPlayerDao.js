var worldPlayerDao = module.exports;

/**
 * Get world_player by uid
 * @param {String} mysqlc mysql client for Master DB or Slave DB
 * @param {Number} uid
 * @param {Number} worldId
 * @returns {Object} world_player data or null
 */
worldPlayerDao.getWorldPlayerByUid = function (mysqlc, uid, cb) {
  var selectSQL = 'select * from world_player where uid=?';
  var args = [uid];

  mysqlc.query(selectSQL, args, function(err, res) {
    if (err !== null) {
      cb(err, null);
      return;
    }
    if (!!res && res.length > 0) {
      cb(null, res);
    }
    else {
      cb(null, null);
    }
  });
}
