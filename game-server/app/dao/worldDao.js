var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
//var dataApi = require('../util/dataApi');
//var Player = require('../domain/entity/player');
//var User = require('../domain/user');
//var consts = require('../consts/consts');
//var equipmentsDao = require('./equipmentsDao');
//var bagDao = require('./bagDao');
//var fightskillDao = require('./fightskillDao');
//var taskDao = require('./taskDao');
//var async = require('async');
var utils = require('../util/utils');
//var consts = require('../consts/consts');

var worldDao = module.exports;

/**
 * Get world list
 * @returns {object} world name, status, etc
 */

worldDao.getWorldList = function (null, cb) {
  return {
    id:1001,
    name:"zombiezoo",
    stat:1,
    activity:1001,
  };
};
