/*
 * container for playerData
 *
 * TODO: add method 
 * 2013-2014
 * @iamcactus
 */

var util = require('util');
var _ = require('underscore');

var dataApi = require('../../app/util/dataApi');
var formula = require('../../app/util/formula');
var gameInit = require('../../../shared/gameInit');
var commonUtils = require('../../../shared/util/commonUtils');

/**
 * Initialize a new 'PlayerUnit' with the given 'opts'.
 *
 * @param {Object} opts
 * @api public
 */
var PlayerUnit = function(opts) {
  this.playerUnit = {};
  var temp = opts.playerUnit;
  for (var i=0; i<temp.length; i++) {
    var j = temp[i].position_id;
    var o = {};
    // data in player_unit
    o.playerId     = temp[i].player_id;
    o.positionId   = temp[i].position_id;
    o.playerCardId = temp[i].player_card_id;
    o.weaponId     = temp[i].weapon_id;
    o.defenderId   = temp[i].defender_id;
    o.shoeId       = temp[i].shoe_id;
    o.jewelryId    = temp[i].jewelry_id;
    o.stdskill1Id  = temp[i].stdskill1_id;
    o.stdskill2Id  = temp[i].stdskill2_id;
    o.createdOn    = temp[i].created_on; 
    o.updatedOn    = temp[i].updated_on;

    // additional card data
    var cardObj = commonUtils.getObj(opts.playerCard, 'id', temp[i].player_card_id);
    if (!!cardObj) {
      o.cardId  = cardObj.card_id;
      o.cardObj = cardObj;
    }
    
    // additional skill data
    var s = {}; // skill object
    if (!!o.cardId) {
      var cardData   = dataApi.card.findBy('card_id', o.cardId);
      // s1 is KN naming. Fxck
      s['s1'] = {
        skillId:  cardData.skill_k,
        lv:       formula.skillLevel(cardObj.level),
      };
      if (!!o.stdskill1Id) {
        var s2Data = commonUtils.getObj(opts.playerSkill, 'id', o.stdskill1Id);
        // s2 is KN naming. Fxck
        s['s2'] = {
          skillId:  s2Data.skill_id,
          lv:       s2Data.level,
        };
      }
      if (!!o.stdskill2Id) {
        var s3Data = commonUtils.getObj(opts.playerSkill, 'id', o.stdskill2Id);
        // s3 is KN naming. Fxck
        s['s3'] = {
          skillId:  s3Data.skill_id,
          lv:       s3Data.level,
        };
      }
      o.skillObj = s; // set skills
    }

    // additional equip data
    var e = {}; // equip object
    if (!!o.weaponId) {
      var e1Data = commonUtils.getObj(opts.playerEquip, 'id', o.weaponId);
      e['e1'] = {
        equipId: e1Data.equip_id,
        lv:      e1Data.level
      };
    }
    if (!!o.defenderId) {
      var e2Data = commonUtils.getObj(opts.playerEquip, 'id', o.defenderId);
      e['e2'] = {
        equipId: e2Data.equip_id,
        lv:      e2Data.level
      };
    }
    if (!!o.shoeId) {
      var e3Data = commonUtils.getObj(opts.playerEquip, 'id', o.shoeId);
      e['e3'] = {
        equipId: e3Data.equip_id,
        lv:      e3Data.level
      };
    }
    if (!!o.jewelryId) {
      var e4Data = commonUtils.getObj(opts.playerEquip, 'id', o.jewelryId);
      e['e4'] = {
        equipId: e4Data.equip_id,
        lv:      e4Data.level
      };
    }
    o.equipObj = e; // set equips

    this.playerUnit[j] = o;
  }
};

module.exports = PlayerUnit;

PlayerUnit.prototype.unit = function() {
  return this.playerUnit;
};

/**
 * Parse String to json for "formation" in KN
 *
 * @return {Object}
 */
PlayerUnit.prototype.toJSON4FORMATION = function() {
  //var timeStamp = Math.round(new Date().getTime()/1000); //unixtime
  var on    = []; // main team
  var back  = []; // sub team

  var teamPeople = gameInit.BATTLE_INIT.TEAM_PEOPLE;

  if (!!this.playerUnit) {
    for (var i in this.playerUnit) {
      if (i <= teamPeople) {
        on.push({
          playerCardId: this.playerUnit[i].playerCardId,
          pos:          this.playerUnit[i].positionId,
          cardId:       this.playerUnit[i].cardId
        });
      }
      else {
        back.push({
          playerCardId: this.playerUnit[i].playerCardId,
          pos:          this.playerUnit[i].positionId,
          cardId:       this.playerUnit[i].cardId
        });
      }
    }
  }
  return {
    on:     on,
    back:   back,
    count:  gameInit.UNIT_INIT.COUNT,
    conf:   gameInit.UNIT_INIT.CONF
  };
};

/**
 * Parse String to json for "general_dress" in KN
 *
 * @return {Object}
 */
PlayerUnit.prototype.toJSON4DRESS = function() {
  var o = {};

  if (!!this.playerUnit) {
    for (var i in this.playerUnit) {
      var pos = this.playerUnit[i].positionId;
      var p = _.extend({}, this.playerUnit[i].skillObj);
      if (!!this.playerUnit[i].equipObj) {
        o[pos] = _.extend(p, this.playerUnit[i].equipObj);
      }
    }
  }
  return o;
};
