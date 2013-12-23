/**
 * Module dependencies
 */

var dataApi = require('../../../util/dataApi');
//var consts = require('../../../consts/consts');
//var taskDao = require('../../../dao/taskDao');
var logger = require('pomelo-logger').getLogger(__filename);
//var taskReward = require('../../../domain/taskReward');
//var pomelo = require('pomelo');
//var underscore = require('underscore');

var playerParamDao = require('../../../dao/playerParamDao');
var playerMissionLog = require('../../../dao/playerMissionLog');
var playerParamCached = require('../../../cache/playerParamCached');

var CODE = require('../../../../../shared/code');
var commonUtils = require('../../../../../shared/util/commonUtils');
var async = require('async');

module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
  if (!this.app)
    logger.error(app);
};

var pro = Handler.prototype;

/**
 * Get mission list/hist
 * Handle the request from client, and response result to client
 *
 * @param {Object} msg
 * @param {Object} session
 * @param {Function} next
 * @returns {Object} mission list/hist or null
 * @api public
 */
pro.getMissionList = function(msg, session, next) {
  var resValidation = commonUtils.validate('getMissionList', msg);
	if(!resValidation) {
    console.log('resValidation fail');
		next(null, {code: CODE.ERR_WRONG_PARAM});
		return;
	}
  console.log('enter getMissionList');

  // playerId should be checked with session
	var playerId = msg.playerId; // just for debug, playerId should be got from session
  var worldId = 1001; // just for debug, worldId shoule be got from session
  var mapId = msg.mapId; // same as chapter id 

  if(!commonUtils.parseNumber(mapId)) {
    console.log('parseNumber fail');
		next(null, {code: CODE.ERR_WRONG_PARAM});
		return;
  }

  var item = dataApi.map.findById(mapId);
  if (!item) {
    console.log('dataApi.map.findById(mapId) fail for map:' + mapId);
		next(null, {code: CODE.ERR_WRONG_PARAM});
		return;
  }

  var ids = item.ids;// id in mission_data with the same mapId
  if (!ids) {
    console.log('dataApi.map.findById(mapId) got no ids for map:' + mapId);
		next(null, {code: CODE.ERR_WRONG_PARAM});
		return;
  }

  //var memcached = this.app.get('memcached');
  //var missionLog = {};

  var dbhandle_s = commonUtils.worldDBR(worldId);
  var mysqlc = this.app.get(dbhandle_s);

  // first get playerMissionLog from Slave DB
  playerMissionLog.get(mysqlc, playerId, ids, function(err, res) {
    if (err) {
      logger.error('error with playerMissionLog: '  + ' err: ' + err.message);
	    next(null, {code: CODE.MESSAGE.ERR, error:err});
  	  return;
    }
    else {
      if (!!res && res.length > 0) { // gets
        // return mission list/hist
        console.log(res);
        next(null, {code: 200, missionLog:res}); 
      }
      else {
        next (null, {code: 200});
      }
    }
  });
};

  /*
    // first get playerParam from memcached
    playerParamCached: function(callback) {
      playerParamCached.get(memcached, playerId, function(err, res) {
        if (err) {
          logger.error('error with playerParamCached: '  + ' err: ' + err.message);
          // should not return err, continue to get from DB
	  			//next(null, {code: CODE.MESSAGE.ERR, error:err});
  	  	  //return;
        }
        else {
          
        }
      });
    },

    // If YES, hit
    // If NO, fail then get from slave and set into memcached
  }, function(err, res) {
    if (err) {
      logger.error('error with getMissionList: '  + ' err: ' + err.message);
			next(null, {code: CODE.FAIL, error:err});
      return;
    }
    else {
      // first get playerMissionLog from memcached
      // If YES, hit
      // If NO, fail then get from slave and set into memcached

      // return mission list/hist
    }
  */

/**
 * Battle one time ( there is another api means battleMulti/ShaoDang )
 * Handle the request from client, and response result to client
 *
 * @param {Object} msg including:mapId, missionId
 * @param {Object} session
 * @param {Function} next
 * @api public
 */
pro.battleOnce = function(msg, session, next) {
	var playerId = msg.playerId; // just for debug, should be got from session
	//var player = session.area.getPlayer(playerId);
  var mapId = msg.mapId;
  var missionId = msg.missionId;

  var resValidation = commonUtils.validate('battleOnce', msg);
	if(!resValidation) {
    console.log('resValidation fail in battleOnce');
		next(null, {code: CODE.ERR_WRONG_PARAM});
		return;
	}
  console.log('enter battleOnce');

  // check start
  // 1. check if have energy
  // 2. check if is next mission
  // 3. check if reached max battle times in one day
  // check end

  // battle start

  // Collect user data
  // 1. get info for player_unit
  // 2. get info for player_card
  // 3. get info for player_equi
  // 4. get info for player_skill
  // 5. get info for player skill_effect

  // 6. get info for player_pet
  // 7. get info for pet_skill_data
  // 8. get info for pet_skill_effect

  // 6. get info for npc unit
  // 7. get info for npc skill
  // 8. get info for npc skill_effect


	var tasks = player.curTasks;
	var taskIds = [];
	for (var id in tasks) {
		var task = tasks[id];
		if (task.taskState === consts.TaskState.COMPLETED_NOT_DELIVERY) {
			taskIds.push(id);
		}
	}
	taskReward.reward(session.area, player, taskIds);
	player.handOverTask(taskIds);
	next(null, {
		code: consts.MESSAGE.RES,
		ids: taskIds
	});
};

/**
 * Get history tasks of the player.
 * Handle the request from client, and response result to client
 *
 * @param {object} msg
 * @param {object} session
 * @param {function} next
 * @api public
 */
pro.getHistoryTasks = function(msg, session, next) {
	var playerId = msg.playerId;
	taskDao.getTaskByPlayId(playerId, function(err,tasks) {
		if (err) {
			logger.error('getHistoryTasks failed!');
			next(new Error('fail to get history tasks'));
		} else {
			var length = tasks.length;
			var reTasks = [];
			for (var i = 0; i < length; i++) {
				var task = tasks[i];
				reTasks.push({
					acceptTalk: task.acceptTalk,
					item: task.item,
					name: task.name,
					id: task.id,
					exp: task.exp,
					taskData: task.taskData,
					taskState: task.taskState
				});
			}
			next(null, {
				code: consts.MESSAGE.RES,
				route: 'onGetHistoryTasks',
				reTasks: reTasks
			});
		}
	});
};

/**
 * Get new Task for the player.
 *
 * @param {object} msg
 * @param {object} session
 * @param {function} next
 * @api public
 */

pro.getNewTask = function(msg, session, next) {
  var player = session.area.getPlayer(msg.playerId);
  var tasks = player.curTasks;
  if(!underscore.isEmpty(tasks)) {
    var keysList = underscore.keys(tasks);
    keysList = underscore.filter(keysList, function(tmpId) {
      var tmpTask = tasks[tmpId];
      if(tmpTask.taskState <= consts.TaskState.COMPLETED_NOT_DELIVERY) {
        return true;
      } else {
        return false;
      }
    });
    if(keysList.length > 0) {
      var maxId = underscore.max(keysList);
      var task = dataApi.task.findById(tasks[maxId].kindId);
      if(!task) {
        logger.error('getNewTask failed!');
        next(new Error('fail to getNewTask!'));
      } else {
        next(null, {
          code: consts.MESSAGE.RES,
          task: task
        });
      }
      return;
    }
  }

	var id = 0;
	taskDao.getTaskByPlayId(msg.playerId, function(err, tasks) {
		if (!!err) {
			logger.error('getNewTask failed!');
			next(new Error('fail to getNewTask!'));
		//do not start task
		} else {
			var length = tasks.length;
			if (length > 0) {
				for (var i = 0; i < length; i++) {
					if (parseInt(tasks[i].kindId) > id) {
						id = parseInt(tasks[i].kindId);
					}
				}
			}
			var task = dataApi.task.findById(++id);
			next(null, {
				code: consts.MESSAGE.RES,
				task: task
			});
		}
	});
};
