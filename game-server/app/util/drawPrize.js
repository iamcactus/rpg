var drawPrize = module.exports;
var logger = require('pomelo-logger').getLogger(__filename);

var equip     = require('../../config/data/equip');
var mission   = require('../../config/data/mission');
var map       = require('../../config/data/map');
var nature    = require('../../config/data/nature'); // hero's zuhe
var natureCondition = require('../../config/data/natureCondition'); // hero's ZuHe TiaoJian
var NGWord    = require('../../config/data/NGWord');
var pet       = require('../../config/data/pet');
var petSkill  = require('../../config/data/petSkill');
var skill     = require('../../config/data/skill');
var dataApi   = require('../../app/util/dataApi');
var calcParam = require('../../../shared/forceConf');
var cardConf = require('../../../shared/cardConf');
var equipConf = require('../../../shared/equipConf');
var gameInit  = require('../../../shared/gameInit');
var oddsConf  = require('../../../shared/oddsConf');
var PROP_CONST = require('../../../shared/propertyConsts');

var _ = require('underscore');

/*
 * generate cards randomly
 * @param {Number} type type in card_data
 * @param {Number} star star in card_data
 * @param {Number} num num is how many prize
 * @returns {object} array of card data
 */ 
var cardPrize = function(type, star, num) {
  var result = [];
  var cardArray = dataApi.card.findMultiBy('star', Number(star));
  
  var len = cardArray.length;
  if (len > 0) {
    len--; // idx in [0..len-1];
    for (var i=0; i<num; i++) {
      var idx = _.random(len);
      result.push(cardArray[idx]);
    }
  }
  return result;
};

drawPrize.hero = function(type, star, num) {
  console.log('in drawPrize.hero');
  return cardPrize(type, star, num);
};

var equipPrize = function(type, star, num) {
  var result = [];
  var equipArray;

  if (type == 0) {
    equipArray = dataApi.equip.findMultiBy('star', Number(star));
  }
  else if (type == PROP_CONST.ATK) {
    equipArray = dataApi.weapon.findMultiBy('star', Number(star));
  }
  else if (type == PROP_CONST.DEF) {
    equipArray = dataApi.defender.findMultiBy('star', Number(star));
  }
  else if (type == PROP_CONST.AGI) {
    equipArray = dataApi.shoe.findMultiBy('star', Number(star));
  }
  else if (type == PROP_CONST.HP) {
    equipArray = dataApi.jewelry.findMultiBy('star', Number(star));
  }

  var len = equipArray.length;
  if (len > 0) {
    len--; // idx in [0..len-1];
    for (var i=0; i<num; i++) {
      var idx = _.random(len);
      result.push(equipArray[idx]);
    }
  }
  return result;
};

drawPrize.equip = function(type, star, num) {
  console.log('in drawPrize.equip');
  if (type == 0) {
    var odds = oddsConf.COMPO;
    var r = _.random(odds.MAX - 1);
    if (r < odds.WEAPON) {
      type = PROP_CONST.ATK; // weapon
    }
    else if (r < (odds.WEAPON + odds.DEFENDER)) {
      type = PROP_CONST.DEF; // defender
    }
    else if (r < (odds.WEAPON + odds.DEFENDER + odds.SHOE)) {
      type = PROP_CONST.AGI; // shoe
    }
    else if (r < odds.MAX) {
      type = PROP_CONST.HP; // jewelry
    }
  }
  return equipPrize(type, star, num);
};

var petPrize = function(type, star, num) {
  var result = [];
  var petArray = dataApi.pet.findMultiBy('star', Number(star));
  
  var len = petArray.length;
  if (len > 0) {
    len--; // idx in [0..len-1];
    for (var i=0; i<num; i++) {
      var idx = _.random(len);
      result.push(petArray[idx]);
    }
  }
  return result;
};

drawPrize.pet = function(type, star, num) {
  console.log('in drawPrize.pet');
  return petPrize(type, star, num);
};
