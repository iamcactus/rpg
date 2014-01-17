/**
 *Module dependencies
 */

var util = require('util');

var dataApi = require('../../app/util/dataApi');
var formula = require('../../app/util/formula');
var gameInit = require('../../../shared/gameInit');
var Pet = require('./Pet');
var Card = require('./Card');


/**
 * Initialize a new 'Bag' with the given 'opts'.
 *
 * @param {Object} opts
 * @api public
 */

var Bag = function(opts) {
	this.playerId = Number(opts.playerId);
  this.bagType        = opts.bagType;       // bagType
  this.playerCard     = opts.playerCard;    // card_data
  this.playerEquip    = opts.playerEquip;   // equip_data
  this.playerPet      = opts.playerPet;     // pet_data
  this.playerSkill    = opts.playerSkill;   // skill_data
  this.playerItem     = opts.playerItem;    // item_data 
};

/**
 * Expose 'Entity' constructor
 */

module.exports = Bag;


/**
 * Parse String to json for "_G_bag_equip" in KN
 *
 * @return {Object}
 */
Bag.prototype.toJSON4EQUIP = function() {
  var e = {}; // all equips object
  if (!!this.playerEquip) {
    var temp = this.playerEquip;
    for (var i=0; i<temp.length; i++) {
      var o = {}; // current equip object
      var equipObj = dataApi.equip.findBy('equip_id', temp[i].equip_id);
      var equipConf = gameInit.EQUIP_CONF[equipObj.type];
      o.id      = temp[i].id;
      o.equipId = temp[i].equip_id;
      o.lv      = temp[i].level;
      o.stage   = 0; // default
      o.type    = equipConf.TYPE;
      o.group   = equipObj.group_id;
      o.initial = equipObj.initial;
      o.price   = formula.equipPrice(temp[i].level, temp[i].equip_id);
      o.star    = equipObj.star;
      o.figure  = formula.equipOrigForce(temp[i].equip_id, temp[i].level);
      o.effect  = equipConf.EFFECT;
      o.clv     = 0; // what is this ???
      o.cltimes = 0; // what is this ???

      e[o.id] = o;
    }
  }

  return e;
};

/**
 * Parse String to json for "_G_bag_skill" in KN
 *
 * @return {Object}
 */
Bag.prototype.toJSON4SKILL = function() {
  var s = {}; // all skill object
  if (!!this.playerSkill) {
    var temp = this.playerSkill;
    for (var i=0; i<temp.length; i++) {
      var o = {}; // current skill object
      var skillObj = dataApi.skill.findBy('skill_id', temp[i].skill_id);
      o.id      = temp[i].id;
      o.skillId = temp[i].skill_id;
      o.exp     = temp[i].exp;
      o.lv      = temp[i].level;
      o.isOnarm = temp[i].is_onarm;
      o.price   = skillObj.price;
      o.star    = skillObj.star;
      o.type    = "generalskill"; // TODO remove into some conf
      o.atk_xdlv= 0; // what is this ???
      o.atk_xd  = 0; // what is this ???

      s[o.id] = o;
    }
  }

  return s;
};

/**
 * Parse String to json for "_G_bag_pet" in KN
 *
 * @return {Object}
 */
Bag.prototype.toJSON4PET = function() {
  var p = {}; // all pet object
  if (!!this.playerPet) {
    var temp = this.playerPet;
    for (var i=0; i<temp.length; i++) {
      var P = new Pet(temp[i]);

      var o = {}; // current pet object
      var petObj  = dataApi.pet.findBy('pet_id', temp[i].pet_id);
      o.id        = P.id;
      o.petId     = P.petId;
      o.lv        = P.level;
      o.exp       = P.exp;
      o.stage     = P.evolvedCnt; // TODO: stage is evolution count??
      o.skill     = {};
      if (this.posiSkill1ID) {
        o.skill["a1"] = this.posiSkill1ID;
      }
      if (this.posiSkill2ID) {
        o.skill["a2"] = this.posiSkill2ID;
      }
      if (this.posiSkill3ID) {
        o.skill["a3"] = this.posiSkill3ID;
      }
      if (this.negaSkill1ID) {
        o.skill["b1"] = this.posiSkill1ID;
      }
      if (this.negaSkill2ID) {
        o.skill["b2"] = this.negaSkill2ID;
      }
      if (this.negaSkill3ID) {
        o.skill["b3"] = this.negaSkill3ID;
      }
      o.cur_exp   = formula.currentPetExp(P.exp, P.level);
      o.lvup_exp  = formula.lvupPetExp(P.exp, P.level);
      o.skilllv   = formula.skillLevel(P.level);
      o.atk_xdlv  = 0; // what is this ???
      o.atk_xd    = 0; // what is this ???

      p[o.id] = o;
    }
  }

  return p;
};

/**
 * Parse String to json for "_G_bag_general" in KN
 *
 * @return {Object}
 */
Bag.prototype.toJSON4GENERAL = function() {
  var c = {}; // all card object
  if (!!this.playerCard) {
    var temp = this.playerCard;
    for (var i=0; i<temp.length; i++) {
      var P = new Card(temp[i]);

      var o = {}; // current pet object
      var cardObj  = dataApi.card.findBy('card_id', temp[i].card_id);
      o.id        = P.id;
      o.cardId    = P.cardId;
      o.price     = cardObj.price;
      o.lv        = P.level;
      o.exp       = P.exp;
      o.type      = gameInit.BAG.CARD.type;
      o.sell_silver = cardObj.price;
      o.stage     = P.evolvedCnt; // TODO: stage is evolution count??

      c[o.id] = o;
    }
  }

  return c;
};

/**
 * Parse String to json for "_G_bag_prop" in KN
 *
 * @return {Object}
 */
Bag.prototype.toJSON4PROP = function() {
  var e = {}; // all item object
  if (!!this.playerItem) {
    var temp = this.playerItem;
    for (var i=0; i<temp.length; i++) {
      var o = {}; // current equip object
      var itemObj = dataApi.item.findBy('item_id', temp[i].item_id);
      o.id      = temp[i].id;
      o.itemId  = temp[i].item_id;
      o.type    = itemObj.comment;
      o.price   = itemObj.price;
      o.num     = temp[i].num;

      e[o.id] = o;
    }
  }

  return e;
};

