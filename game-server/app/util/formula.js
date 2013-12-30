var formula = module.exports;
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

var _ = require('underscore');

// default names of key
var basicKeys = {
  "1":  "hp_o",
  "2":  "atk_o",
  "3":  "def_o",
  "4":  "agi_o"
};

// ids is [weaponId, defenderId, shoeId, jewelryId]
// return 0 in case of [0, 0, 0, 0]
var hasEquip = function(ids) {
  if (!!ids) {
    for (var i in ids) {
      if (ids[i] > 0) {
        return 1;
      }
    }
  }
  return 0;
};

/*
 * calculate original force
 * @param {Number} cardId card_id in card_data
 * @param {Number} level card level
 * @returns {object} card original force with the level
 */ 
formula.origForce = function(cardId, level) {
  var cardObj   = dataApi.card.findBy('card_id', cardId);
  var cardBeta  = calcParam.cardBeta(cardObj.star);
  var cardGammar = calcParam.cardGammar(cardObj.star, cardObj.type);

  level--;  // beta calculation is used only for level up
  var hp  = Math.ceil(cardObj.hp_c + level * cardBeta.hp * cardGammar.hp);
  var atk = Math.ceil(cardObj.atk_c + level * cardBeta.atk * cardGammar.atk);
  var def = Math.ceil(cardObj.def_c + level * cardBeta.def * cardGammar.def);
  var agi = Math.ceil(cardObj.agi_c + level * cardBeta.agi * cardGammar.agi);

return {
    "hp_o":   hp,
    "atk_o":  atk,
    "def_o":  def,
    "agi_o":  agi
  };
};

/*
 * calculate evolve addon force
 * @param {Number} cardId card_id in card_data
 * @param {Number} cnt evolved_cnt in player_card
 * @returns {object} card addon force with the evolved_cnt
 */ 
formula.evolveAddon = function(cardId, cnt) {
  var hp = 0;
  var atk = 0;
  var def = 0;
  var agi = 0;

  if (!!cnt && cnt > 0) { 
    var cardObj   = dataApi.card.findBy('card_id', cardId);
    var evolveParam  = cardConf.getAlpha(cardObj.star);

    // up limit check for cnt
    if (cnt <= evolveParam.MAX_STAGE) {
      hp  = evolveParam.HP * cnt;
      atk = evolveParam.ATK * cnt;
      def = evolveParam.DEF * cnt;
      agi = evolveParam.AGI * cnt;
    }
  }

  return {
    "hp_o":   hp,
    "atk_o":  atk,
    "def_o":  def,
    "agi_o":  agi
  };
};

/*
 * ZhuangBei ShuXing
 * calculate equipment origin force
 * @param {Number} equipId equip_id in equip_data
 * @param {Number} level level in player_equip
 * @returns {object} equip origin force
 */ 
formula.equipOrigForce = function(equipId, level) {
  if (!equipId) {
    return 0;
  }
  var equipObj   = dataApi.equip.findBy('equip_id', equipId);
  var equipParam = equipConf.equipDelta(equipObj.star);
  level--; // addon calculation is used only for level up
  return Math.ceil(equipObj.initial + equipParam[equipObj.type] * level);
};

/*
 * ZhuangBei Fujia
 * calculate equipment addon force
 * @param {Number} equipId equip_id in equip_data
 * @param {Number} cardId card_id in card_data
 * @returns {Number} equip addon force
 */ 
formula.equipAddon = function(equipId, cardId) {
  if (!equipId) {
    return 0;
  }
  var equipObj   = dataApi.equip.findBy('equip_id', equipId);
  var cardObj   = dataApi.card.findBy('card_id', cardId);
  var addon = 0;

  if (equipObj.apstype == cardObj.type) {
    addon = equipObj.apinit;
  }
  return addon;
};

// here is the real calculation for natureAddon
var natureAddonCalc = function(addon, property, effect) {
  var key = basicKeys[property];
  addon[key] = Math.ceil(addon[key] * (effect) / 100);
  return addon;
};

// ids: array
// id: number
var contains = function(ids, id) {
  if (!!ids) {
    var i = ids.length;
    while (i--) {
      if (ids[i] == id) {
        return true;
      }
    }
  }
  return false;
};

// conditionArray: array
// ids: array
var checkNature = function(conditionArray, ids) {
  if (!!conditionArray) {
    var i = conditionArray.length;
    var j = 0;
    while (i--) {
      if (contains(ids, conditionArray[i])) {
        j++;
      };
    }
    if (j == conditionArray.length) {
      return true;
    }
  }
  return false;
};

/*
 * Zuhe 
 * calculate nature addon force
 * @param {Array} cards card list by (player_id, position_id in player_unit);
 * @param {Array} equips equip list by (player_id, position_id in player_unit);
 * @param {Number} cardId card_id in card_data
 * @param {Number} level card level
 * @returns {object} nature addon force
 */ 
// wakarinikui
formula.natureAddon = function(cards, equips, cardId, level) {

  var addon = formula.origForce(cardId, level);
 
  var natureAddon = {
    "hp_o":   0,
    "atk_o":  0,
    "def_o":  0,
    "agi_o":  0
  };

  var cardObj   = dataApi.card.findBy('card_id', cardId);
  var conditionObj = dataApi.natureCondition.findBy('card_id', cardId);
  var natureList = conditionObj.natures;
  if (!!natureList && !!addon) {
    for (var i in natureList) {
      var natureId  = natureList[i];
      var natureObj = dataApi.nature.findBy('nature_id', natureId);
      if (natureObj.type == 1) { // card zuhe
        if (checkNature(natureObj.condition, cards, cardId)) {
          var key = basicKeys[natureObj.property]; // hp_o or atk_o or def_o or agi_o
          natureAddon[key] = addon[key]; // copy value from addon for the "key"
          natureAddon = natureAddonCalc(natureAddon, natureObj.property, natureObj.effect);
        };
      }
      else if (natureObj.type == 2) { // equip zuhe
        if (hasEquip(equips)) { // reject case of [0,0,0,0]
          if (checkNature(natureObj.condition, equips, cardId)) {
            var key = basicKeys[natureObj.property]; // hp_o or atk_o or def_o or agi_o
            natureAddon[key] = addon[key]; // copy value from addon for the "key"
            natureAddon = natureAddonCalc(natureAddon, natureObj.property, natureObj.effect);
          };
        }
      }
    }
  }

  return natureAddon;
};

/* nature skill level
 * @param {Number} level card level
 * @returns {Number} skillLevel
 */ 
formula.skillLevel = function(level) {
  return Math.floor(level / 10) + 1;
};

// temp
formula.stoneType = function(itemId) {
  var type = '';
  switch(itemId) {
    case 8001:
      type = 'crit';
      break;
    case 8002:
      type = 'block';
      break;
    case 8003:
      type = 'dodge';
      break;
    case 8004:
      type = 'hit';
      break;
    case 8005:
      type = 'ctatk';
      break;
    case 8006:
      type = 'kill';
      break;

  }
  return type;
};

// temp
formula.stoneEffect = function(itemId) {
  if(Math.random() > 0.5) {
    return 1;
  }
  else {
    return 0;
  }
};

formula.unitGroupId = function(unitPositionId) {
  if (unitPositionId < 4) {
    return 1;
  }
  else if (unitPositionId < 8) {
    return 2;
  }
}

var getTargetIndex = function(tempArray, teamIndex, teamObj) {
  // for type "atk"
  for (var i in tempArray) {
    var k = tempArray[i];
    for (var j in teamObj) {
      if ((teamObj[j]._index == k) && !!teamObj[j].card_id) {
        return k;
      }
    }
  }
  return -1;
}

/*
 * @param {Number} teamIndex
 * @param {Object} teamObj
 * @returns {Number} idx
 */
formula.getNexter = function(teamIndex, teamObj) {
  var indexArrays = {
    0:  ["1","2","3","0"],
    1:  ["2","3","0","1"],
    2:  ["3","0","1","2"],
    3:  ["0","1","2","3"]
  };

  return getTargetIndex(indexArrays[teamIndex], teamIndex, teamObj);
}

/*
 * @param {Number} teamIndex
 * @param {Object} teamObj
 * @param {Number} skillId
 * @returns {Array}
 */
formula.getTarget = function(teamIndex, teamObj, skillId) {
  var indexArrays = {
    0:  ["0","1","2","3"],
    1:  ["1","2","3","0"],
    2:  ["2","3","0","1"],
    3:  ["3","0","1","2"]
  };

  var target = [];
  if (!skillId) {
  // type "atk"
    var t = getTargetIndex(indexArrays[teamIndex], teamIndex, teamObj);
    if (t > -1) {
      target.push(t);
    }
    return target;
  }
  
  //console.log(skillId);
  var skillObj   = dataApi.skill.findBy('skill_id', skillId);

  if (skillObj.target == 1) { // skill on one target
    var t = getTargetIndex(indexArrays[teamIndex], teamIndex, teamObj);
    if (t > -1) {
      target.push(t);
    }
  }
  else if (skillObj.target == 2) { // skill on two target
    var t1 = getTargetIndex(indexArrays[teamIndex], teamIndex, teamObj);
    if (t1 > -1) {
      target.push(t1);
    }
    var tempArray = _.without(indexArrays[teamIndex], t1);
    var t2 = getTargetIndex(tempArray, teamIndex, teamObj);
    if (t2 > -1) {
      target.push(t2);
    }
  }
  else if (skillObj.target == 4) { // skill on all
    var t1 = getTargetIndex(indexArrays[teamIndex], teamIndex, teamObj);
    if (t1 > -1) {
      target.push(t1);
    }
    var tempArray = _.without(indexArrays[teamIndex], t1);
    var t2 = getTargetIndex(tempArray, teamIndex, teamObj);
    if (t2 > -1) {
      target.push(t2);
    }
    tempArray = _.without(indexArrays[teamIndex], t2);
    var t3 = getTargetIndex(teamArray, teamIndex, teamObj);
    if (t3 > -1) {
      target.push(t3);
    }
    tempArray = _.without(indexArrays[teamIndex], t3);
    var t4 = getTargetIndex(teamArray, teamIndex, teamObj);
    if (t4 > -1) {
      target.push(t4);
    }
  }

  return target;
};

// attack type for "atk_skill"
// make random if skill attack or not
// if skill attack, return the skillObj
// if not, return empty object
formula.atkSkill = function(skillObj) {
  if (!skillObj) {
    return {};
  }

  var tLimit = 0.1; // test parameter

  // 0.4 < t <= 1.0 s1
  // 0.2 < t <= 0.4 s2
  // 0.0 < t <= 0.2 s3
  var t = Math.random();
  if(t > 0.4) {
    var skillData = dataApi.skill.findBy('skill_id', skillObj.s1.skill_id);
    if (t * skillData[skillObj.s1.skill_lv].success / 100 > tLimit) {
      return skillObj.s1;
    }
  }
  else if (t > 0.2) {
    if (!!skillObj.s2) {
      var skillData = dataApi.skill.findBy('skill_id', skillObj.s2.skill_id);
      if (t * skillData[skillObj.s2.skill_lv].success / 100 > tLimit) {
        return skillObj.s2;
      }
    }
  }
  else if (t > 0) {
    if (!!skillObj.s3) {
      var skillData = dataApi.skill.findBy('skill_id', skillObj.s3.skill_id);
      if (t * skillData[skillObj.s3.skill_lv].success / 100 > tLimit) {
        return skillObj.s3;
      }
    }
  }
  return {};
};

// team: array
formula.replaceIndex = function(team) {
  //console.log(team);
  for (var i = 0; i < team.length; i++) {
    if(!!team[i]) {
      return i;
    }
  }
  return -1;
};

formula.damage = function(atkerObj, atkeeObj, atkSkillObj) {
  var damage = gameInit.BATTLE_INIT.DAMAGE; // default damage

  var param = 1; // battle parameter
  if (atkerObj.atk > atkeeObj.def) {
    if (calcParam.roleRestraint(atkerObj.role) === atkeeObj.role) {
      param = gameInit.BATTLE_INIT.RESTRAINT_PARAM;
    }
    // type: "atk", also is normal attack
    damage = Math.ceil( param * (atkeeObj.def - atkerObj.atk));
  }

  // type "atk_skill"
  if (!_.isEmpty(atkSkillObj)) {
    var skillObj   = dataApi.skill.findBy('skill_id', atkSkillObj.skill_id);
    // damage = Math.ceil(damage * (skillObj[atkSkillObj.skill_lv].effect / skillObj.target));
    damage = Math.ceil(damage * (skillObj[atkSkillObj.skill_lv].effect / 100)); // effect is in 1-100
  }

  return damage;
};
