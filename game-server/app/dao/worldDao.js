var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var DBCONF = require('../../../shared/dbconf');
var async = require('async');
var utils = require('../util/utils');

var worldDao = module.exports;

/**
 * Get world list
 * @returns {object} world name, status, etc
 */

worldDao.getWorldList = function (mysqlc, cb) {
  var selectSQL = 'select * from world_data';

	mysqlc.query(selectSQL,args,function(err, res) {
		if(err) {
			utils.invokeCallback(cb, err.message, null);
			return;
		}

		if(!!res && res.length > 0) { //exists
			utils.invokeCallback(cb, null, res);
		} else {
			utils.invokeCallback(cb, null, null); // the last "null" make sure "if(world)" be failed
		}
	});
};
