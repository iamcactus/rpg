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

var chatDao = module.exports;

/**
 * Insert into chat_data
 * @param {int} user_id
 * @param {varchar} msg
 * @param {int} created_on
 */
chatDao.add = function (user_id, msg, created_on, cb) {
  var insertSQL = 'insert into chat_data(user_id, msg, created_on) values (?,?,?)'; 
  var args = [user_id, msg, created_on];
  pomelo.app.get('game_master_m').insert(insertSQL, args, function(err, res) {
    if (err !== null) {
      console.log(err);
      console.log(user_id, msg, created_on);
      utils.invokeCallback(cb, err, null);
    }
    else {
      if (!!res) {
        console.log('in if');
        console.log(res);
        utils.invokeCallback(cb, null, res);
      }
      else {
        console.log('in else');
        utils.invokeCallback(cb, null, {user_id:user_id, res:0});
      }
    }
  });
};
