/*
 * pomelo api for unit
 * 2013-2014
 * @iamcactus
 */
var async = require('async');
var logger = require('pomelo-logger').getLogger(__filename);
var _ = require('underscore');

var utils       = require('../../../util/utils');
var commonUtils = require('../../../../../shared/util/commonUtils');
var CODE        = require('../../../../../shared/code');
var dataApi = require('../../../util/dataApi');
var formula = require('../../../util/formula');

var playerUnitAllData = require('../../../dao/union/playerUnitAllData');

var PlayerUnit  = require('../../../domain/PlayerUnit');
//var Mission     = require('../../../domain/Mission');

/**
 * make report for KN
 */
var _makeReport = function(data) {
  var o = {};

  var Unit = new PlayerUnit(data);
  var unit = Unit.unit();
  var u = {}; // temp obj
  for (var i in unit) {
    var obj = unit[i];

    var id = obj.playerCardId;
    var p = {}; // temp obj
    p.id      = obj.playerCardId;
    p.cardId  = obj.cardId;

    var t = obj.cardObj;
    p.exp     = t.exp;
    p.lv      = t.level;
    p.stage   = t.evolved_cnt;

    var cardData   = dataApi.card.findBy('card_id', p.cardId);
    p.star    = cardData.star;
    p.role    = cardData.role;

    var conditionObj = dataApi.natureCondition.findBy('card_id', p.cardId);
    p.natural = conditionObj.natures;
    p.skill_k = cardData.skill_k;
    p.cur_exp = formula.currentExp(p.exp, p.lv);
    p.lvup_exp= formula.lvupExp(p.exp, p.lv);
    p.rest_exp= 0; // temp, what is this??
    p.atk_i   = cardData.atk_c;
    p.def_i   = cardData.def_c;
    p.hp_i    = cardData.hp_c;
    p.agi_i   = cardData.agi_c;
    p.skill_lv= formula.skillLevel(p.lv);
    p.type    = cardData.type;
    p.atk_xd  = 0;
    p.def_xd  = 0;
    p.hp_xd   = 0;
    p.agi_xd  = 0;
    p.atk_xdlv= 0;
    p.def_xdlv= 0;
    p.hp_xdlv = 0;
    p.agi_xdlv= 0;

    var origForce = formula.origForce(p.cardId, p.lv);
    p.hp      = origForce.hp_o;
    p.atk     = origForce.atk_o;
    p.def     = origForce.def_o;
    p.agi     = origForce.agi_o;
    p.active_natural = [];
   
    u[id] = p;
  }

  o["_D_bag"] = {};
  o["_D_bag"]["general"] = u;

  return o;
};

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;

	if(!this.app)
		logger.error(app);
};

var pro = Handler.prototype;

/**
 * Check token and bind user info into session.
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
pro.unitInfo = function(msg, session, next) {
  console.log('enter connector.unitInfo');
  console.log(msg);
  var playerId = msg.playerId;
  // temp, should be got from session
  var worldId = commonUtils.normalizeWorldId(msg.worldId);
  // temp, should be got from session

  // db handle
  var dbhandle_s = commonUtils.worldDBR(worldId);
  var mysqlc = this.app.get(dbhandle_s);

	async.auto({
    unitAllData: function(callback) {
      playerUnitAllData.get(mysqlc, playerId, callback);
    }
  }, function(err, res) {
		if (!!err || !res) {
      var code = CODE.FAIL;
      if (err.code) {
        code = err.code;
      }
      next(null, {code: code});
			return;
		}
    else {
      console.log('before makeReport');
      var report = _makeReport(res.unitAllData);
		  next(null, {code: CODE.OK, result: report});
      return;
    }
	});
};
