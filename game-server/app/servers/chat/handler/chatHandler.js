var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var chatRemote = require('../remote/chatRemote');
var playerDao = require('../../../dao/playerDao.js');
var chatDao = require('../../../dao/chatDao.js');

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

var handler = Handler.prototype;

/**
 * Send messages to users
 *
 * @param {Object} msg message from client
 * @param {Object} session
 * @param  {Function} next next stemp callback
 *
 */
handler.send = function(msg, session, next) {
	var rid = session.get('rid');
	var uid = session.uid.split('*')[0];
	var channelService = this.app.get('channelService');
  var channel = channelService.getChannel(rid, false);

  // get player data from memcached
  var keyUserID = 'uid:' + uid;
  var memcached = pomelo.app.get('memcached');
  var name = memcached.get(keyUserID, function(err, res) {
    if (err) {
      console.log('unhit name, uid:' + uid);
    }
    //else {
    //  memcached.end();
    //}
  });

  // get player data from DB
  var dbhandle = 'game_world_' + msg.worldId + '_s';
  playerDao.getPlayersByUid(dbhandle, uid, function(err, player) {
    if (err || !player) {
      console.log('username not exist!');
      return;
    }
    console.log(player);
    var username = player.name;
    memcached.set(keyUserID, username, 10, function(err, res) {
      if (err)
        console.error(err);

      console.log('setted memcached:' + username);
      console.log(res);
    });
    var unixTime = Math.round(new Date().getTime()/1000);
    // log chat data
    console.log(uid, msg, unixTime);
    chatDao.add(dbhandle, uid, msg.content, unixTime, function(err, cb) {
     if (err) {
      console.log('chat_data insert error');
      // continure even log failed.
     }
    });

    var param = {
		  msg: msg.content,
  		from: username,
	  	target: msg.target
  	};

  	//the target is all users
  	if(msg.target == '*') {
	  	channel.pushMessage('onChat', param);
  	}
    //the target is specific user
  	else {
  		var tuid = msg.target + '*' + rid;
	  	var tsid = channel.getMember(tuid)['sid'];
		  channelService.pushMessageByUids('onChat', param, [{
  			uid: tuid,
	  		sid: tsid
		  }]);
  	}
  });

	next(null, {
	 route: msg.route
  });
};
