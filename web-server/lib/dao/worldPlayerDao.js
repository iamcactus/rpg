var worldPlayerDao = module.exports;

/**
 * Get world_player by uid
 * @param {String} mysqlc mysql client for Master DB or Slave DB
 * @param {Number} uid
 * @param {Number} worldId
 * @returns {Object} world_player data or null
 */
worldPlayerDao.getByUid = function (mysqlc, uid, cb) {
  var selectSQL = 'select * from world_player where uid=?';
  var args = [uid];

  mysqlc.query(selectSQL, args, function(err, res) {
    if (!!err) {
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
};

worldPlayerDao.getByUidAndWorldId = function (mysqlc, uid, worldId, cb) {
  var selectSQL = 'select * from world_player where uid=? and world_id=?';
  var args = [uid, worldId];

  mysqlc.query(selectSQL, args, function(err, res) {
    if (!!err) {
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
};
