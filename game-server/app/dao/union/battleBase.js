var battleBase = module.exports;

// battle three steps:
// battle step 1) prepare (battle preparation)
// battle step 2) turn (battle turn)
// battle step 3) win (battle result)

var async = require('async');
var mysql = require('mysql');
var util = require('util');
var _ = require('underscore');

var npcUnitAllData = require('../../dao/union/npcUnitAllData');
var playerUnitAllData = require('../../dao/union/playerUnitAllData');
var Player    = require('../../domain/player');
var formula   = require('../../util/formula');
var dataApi   = require('../../util/dataApi');
var utils     = require('../../util/utils');
var gameInit  = require('../../../../shared/gameInit');
var commonUtils = require('../../../../shared/util/commonUtils');

battleBase.unitForce = function(unitAllData) {
  if (!unitAllData) {
    return null;
  }
  var playerCard  = unitAllData.playerCard;   // player_card
  var playerEquip = unitAllData.playerEquip;  // player_equip
  var playerPet   = unitAllData.playerPet;    // player_pet
  var playerMeridian  = unitAllData.playerMeridian; // unit_meridian
  var playerUnit = unitAllData.playerUnit; // player_unit
  var playerSkill = unitAllData.playerSkill; // player_skill

  var force = [];
  var unitHP  = 0;
  var unitATK = 0;
  var unitDEF = 0;
  var unitAGI = 0;

  var cardIds = []; // array for card_id in card_data
  for (var i in playerCard) {
    var c = playerCard[i].card_id;
    if (!_.contains(cardIds, c)) {
      cardIds.push(c);
    }
  }
  console.log('-----151------');
  console.log(cardIds);

  for (var i in playerUnit) {
    var card_sid    = playerUnit[i].player_card_id; // sid is short for serial id
    if (!card_sid) {
      console.log('undefied card_sid in playerUnit. i = ' + i);
      continue;
    }
    var weapon_sid  = playerUnit[i].weapon_id;
    var defender_sid  = playerUnit[i].defender_id;
    var shoe_sid    = playerUnit[i].shoe_id;
    var jewelry_sid = playerUnit[i].jewelry_id;
   
    var cardObj     = {};
    var weaponObj   = {
      "equip_id": 0,
      "level":    0
    };
    var defenderObj = {
      "equip_id": 0,
      "level":    0
    };
    var shoeObj     = {
      "equip_id": 0,
      "level":    0
    };
    var jewelryObj  = {
      "equip_id": 0,
      "level":    0
    };
    var meridianObj = {
        "crit":   0,
        "block":  0,
        "kill":   0,
        "dodge":  0,
        "hit":    0,
        "double": 0,
        "ctack":  0,
    };

    for (var j in playerCard) {
      if (playerCard[j].id == card_sid) {
        cardObj["card_id"]     = playerCard[j].card_id;
        cardObj["level"]  = playerCard[j].level;
        cardObj["evolved_cnt"]  = playerCard[j].evolved_cnt;
        cardObj["level"]  = playerCard[j].level;
        cardObj["data"]   = dataApi.card.findBy('card_id', playerCard[j].card_id);
      }
    }
    
    if (!!playerEquip) {
      for (var j in playerEquip) {
        if (!!weapon_sid && playerEquip[j].id == weapon_sid) {
          weaponObj["equip_id"] = playerEquip[j].equip_id;
          weaponObj["level"]    = playerEquip[j].level;
        }
        else if (!!defender_sid && playerEquip[j].id == defender_sid) {
          defenderObj["equip_id"] = playerEquip[j].equip_id;
          defenderObj["level"]    = playerEquip[j].level;
        }
        else if (!!shoe_sid && playerEquip[j].id == shoe_sid) {
          shoeObj["equip_id"] = playerEquip[j].equip_id;
          shoeObj["level"]    = playerEquip[j].level;
        }
        else if (!!jewelry_sid && playerEquip[j].id == jewelry_sid) {
          jewelryObj["equip_id"]  = playerEquip[j].equip_id;
          jewelryObj["level"]     = playerEquip[j].level;
        }
      }
    }

    if (!!playerMeridian) {
      var meridian = commonUtils.getObj(playerMeridian, "player_card_id", card_sid);
      if (!!meridian) {
        var mType = formula.stoneType(meridian.stone_id);
        meridianObj[mType] = meridian.stone_id;
      }
    }

    // YuanShi ShuXing
    var origForce         = formula.origForce(cardObj.card_id, cardObj.level);

    // JinHua FuJia
    var evolveAddon       = formula.evolveAddon(cardObj.card_id, cardObj.evolved_cnt);

    // OrigForce: ZhuangBei ShuXing
    // Addon:     ZhuangBei FuJia
    var weaponOrigForce   = formula.equipOrigForce(weaponObj.equip_id, weaponObj.level);
    var weaponAddon   = formula.equipAddon(weaponObj.equip_id, cardObj.card_id);
    var defenderOrigForce = formula.equipOrigForce(defenderObj.equip_id, defenderObj.level);
    var defenderAddon = formula.equipAddon(defenderObj.equip_id, cardObj.card_id);
    var shoeOrigForce     = formula.equipOrigForce(shoeObj.equip_id, shoeObj.level);
    var shoeAddon     = formula.equipAddon(shoeObj.equip_id, cardObj.card_id);
    var jewelryOrigForce  = formula.equipOrigForce(jewelryObj.equip_id, jewelryObj.level); 
    var jewelryAddon  = formula.equipAddon(jewelryObj.equip_id, cardObj.card_id);

    // ZuHe JiaCheng
    var equipIds = [weaponObj.equip_id, defenderObj.equip_id, shoeObj.equip_id, jewelryObj.equip_id];
    var natureAddon   = formula.natureAddon(
      cardIds,
      equipIds,
      cardObj.card_id,
      cardObj.level
    );

    // XingYuan JiaCheng
    // pass

    // ZongHe
    var hp = origForce.hp_o + evolveAddon.hp_o + jewelryOrigForce + jewelryAddon + natureAddon.hp_o;
    var atk = origForce.atk_o + evolveAddon.atk_o + weaponOrigForce + weaponAddon + natureAddon.atk_o;
    var def = origForce.def_o + evolveAddon.def_o + defenderOrigForce + defenderAddon + natureAddon.def_o;
    var agi = origForce.agi_o + evolveAddon.agi_o + shoeOrigForce + shoeAddon + natureAddon.def_o;
  
    unitAGI += agi;
    unitHP  += hp;

    var skillObj = {
      "s1":   { "skill_id": cardObj.data.skill_k,
                "skill_lv": formula.skillLevel(cardObj.level)
              }
    }

    if (!!playerUnit[i].stdskill1_id) {
      var s2 = commonUtils.getObj(playerSkill, "id", playerUnit[i].stdskill1_id);
      if (!!s2) {
        skillObj["s2"] = {
          "skill_id": s2.skill_id,
          "skill_lv": s2.level
        };
      }
    }

    if (!!playerUnit[i].stdskill2_id) {
      var s3 = commonUtils.getObj(playerSkill, "id", playerUnit[i].stdskill2_id);
      if (!!s3) {
        skillObj["s3"] = {
          "skill_id": s3.skill_id,
          "skill_lv": s3.level
        };
      }
    }

    force.push(
      {
        "player_card_id":   playerUnit[i].player_card_id,
        "position":         playerUnit[i].position_id,
        "card_id":          cardObj.card_id,
        "card_level":       cardObj.level,
        "card_star":        cardObj.data.star,
        "card_skill":       skillObj,
        "card_role":        cardObj.data.role,
        "origForce":        origForce,
        "evolveAddon":      evolveAddon,
        "weaponOrigForce":  weaponOrigForce,
        "defenderOrigForce":defenderOrigForce,
        "shoeOrigForce":    shoeOrigForce,
        "jewelryOrigForce": jewelryOrigForce,
        "weaponAddon":      weaponAddon,
        "defenderAddon":    defenderAddon,
        "shoeAddon":        shoeAddon,
        "jewelryAddon":     jewelryAddon,
        "natureAddon":      natureAddon,
        "crit":   meridianObj.crit,
        "block":  meridianObj.block,
        "kill":   meridianObj.kill,
        "dodge":  meridianObj.dodge,
        "hit":    meridianObj.hit,
        "double": meridianObj.dback,
        "ctack":  meridianObj.ctack,
        "hp": hp,
        "atk":atk,
        "def":def,
        "agi":agi,
        "org_hp": hp
      }
    );
  }

  force['playerId'] = playerUnit[0].player_id;
  force['unitHP']   = unitHP;
  force['unitAGI']  = unitAGI;
  force['unitLeftHP']  = unitHP; // this HP will be count donw during battle
  return force;
};

// battle step 1) prepare (battle preparation)
battleBase.prepare = function(playerAllData1, playerForce1, playerAllData2, playerForce2) {
  var p1_pet = {
    "id":     playerAllData1.playerPet[0].id,
    "pet_id": playerAllData1.playerPet[0].pet_id
  };

  var p2_pet = {
    "id":     playerAllData2.playerPet[0].id,
    "pet_id": playerAllData2.playerPet[0].pet_id
  };

  return {
    "p1_pet": p1_pet,
    "p2_pet": p2_pet,
    "uid1":   playerAllData1.playerUnit[0].player_id,
    "uid2":   playerAllData2.playerUnit[0].player_id,
    "p1_agi": playerForce1.unitAGI,
    "p2_agi": playerForce2.unitAGI
  };
};


var battlerInit = function(playerForce, groupId) {
  var HP = playerForce.unitLeftHP;

  var mainTeam  = [];   // player one Main team
  var subTeam   = [];   // player one Sub team

  // if hp, then set team, else return empty {}
  if (HP > 0) { 
    for (var i in playerForce) {
      var p = {};
      p["type"]     = "general";
      p["card_id"]  = playerForce[i].card_id;
      p["lv"]       = playerForce[i].card_level;

      p["hp"]       = playerForce[i].hp;          // the hp left. naming as "hp" only cauz client use the confusing name, FxUK
      p["atk"]      = playerForce[i].atk;
      p["def"]      = playerForce[i].def;
      p["agi"]      = playerForce[i].agi;
      p["skill"]    = playerForce[i].card_skill;
      p["star"]     = playerForce[i].card_star;
      p["role"]     = playerForce[i].card_role;
      p["org_hp"]   = playerForce[i].org_hp;      // the origin HP of the card
      //p["_group"]  = formula.unitGroupId(playerForce1[i].position);
      var indx  = playerForce[i].position;
      indx--;  // position is in [1..8], while indx in [0..3]
      var g = formula.unitGroupId(indx);
      if (g == 1) {
        p["_index"]  = indx;
        p["_group"]  = groupId;
        mainTeam[indx] = p;
      }
      else if (g == 2) {
        indx -= gameInit.BATTLE_INIT.TEAM_PEOPLE;
        p["_index"]  = indx;
        p["_group"]  = groupId ;
        subTeam[indx] = p;
      }
    }
  }

  // skillCnt: skill count down
  return {
    "playerId": playerForce.playerId,
    "unitAGI":  playerForce.unitAGI,
    "unitLeftHP":   playerForce.unitLeftHP,
    "mainTeam": mainTeam,
    "subTeam":  subTeam,
    "groupIndex": groupId,
    "skillCnt": 0
  };
};

var battleQueue = function(firstForce, secondForce) {
  var HPp1 = firstForce.unitLeftHP;
  var HPp2 = secondForce.unitLeftHP;

  var report = {};

  if (HPp1 > 0 && HPp2 > 0) {
    report["type"] = "queue";
    report["sort_index"] = -1;

    report["data"] = {
      "p1":       firstForce.mainTeam,
      "p1_back":  firstForce.subTeam,
      "p2":       secondForce.mainTeam,
      "p2_back":  secondForce.subTeam,
    };
  }
  return report;
};

var battleReplace = function(teamIndex, mainTeamObj, subTeamObj) {
  if (_.isEmpty(subTeamObj)) {
    return -1;
  }
  var idxArray = formula.getTarget(teamIndex, subTeamObj, 0);
  if (!_.isEmpty(idxArray) && idxArray[0] > 0) {
    // replacement
    //delete commonUtils.getObj(mainTeamObj, "_index", teamIndex);
    delete mainTeamObj[teamIndex];
    mainTeamObj[teamIndex] = subTeamObj[idxArray[0]];
    delete subTeamObj[idxArray[0]];
    return idxArray[0];
  }
  return -1;
};

// firstForce: obj
// secondForce: obj
// round: number for battle round
// @returns {number} 1: is over, 0: opposite
var isBattleOver = function(firstForce, secondForce, round) {
  // special rule: battle over if max_round
  if (round == gameInit.BATTLE_INIT.MAX_ROUND) {
    return 1;
  }
  if (!!firstForce && !!secondForce) {
    if (firstForce.unitLeftHP < 1 || secondForce.unitLeftHP < 1) {
      return 1;
    }
    return 0;
  }
  return 1; // one side is undefined, so no battle
};

/*
 * @params {Object} firstForce: who first attack (higher AGI)
 * @params {Object} secondForce: who second attack (lower AGI)
 * @returns {Number} 0 or winner's player_id
 */
var battleWinner = function(firstForce, secondForce) {
  var res = 0;
  if (!!firstForce && !!secondForce) {
    if (firstForce.unitLeftHP == 0) {
      return secondForce.playerId;
    }
    else if (secondForce.unitLeftHP == 0) {
      return firstForce.playerId;
    }
  }
  return res;
};

/*
battleBase.battlerPulse = function(playerForceCard, sortIndex) {
  if (!!playerForceCard && !!playerForceCard.pulse) { // pet_skill_effect, like zhongdu/lengdong
  // show pet_skill_effect
    return {
      "type": playerForceCard.pulse,
      "sort_index": sortIndex,
      "data": {}
    };
  }
}
*/

// battle step 2) turn (battle turn) for type "atk", "atk_skill"
// firstForce's AGI >= secondForce's AGI
// should be insured by the caller
// battle round. 5 round in 1 turn, 10 round at most
var battleRound = function(firstForce, secondForce, turn, round) {
  var win;
  var roundResArray = []; // record battle result here with sort index

  var atkeeIdxArray = []; // array fro target's _index
  var atkerForce;
  var atkeeForce;

  var battlerObj = {};
  var over = 0;
  var sortIndex;

  console.log('-----enter into battleRound----');
  for (var i = 0; i < gameInit.BATTLE_INIT.MAX_STEP; i++ ) {
    var atkType = "atk";  // "atk" or "atk_skill"
    var stepResArray = {
      "atk": [],
      "be_atk": [],
      "change": []
    };

    if (over == 1) {
      break; // stop loop
    }

    // prepre, init battler
    if (_.isEmpty(battlerObj)) {
      battlerObj = firstForce.mainTeam[i];
      sortIndex = i; // TODO: triky?
    }

    // _group is in [1, 2]
    if (battlerObj._group == firstForce.groupIndex) {
      // first attacks second
      atkerForce = firstForce;
      atkeeForce = secondForce;
    }
    else if (battlerObj._group == secondForce.groupIndex) {
      // second attacks first
      atkerForce = secondForce;
      atkeeForce = firstForce;
    }

    // first, check if the battler has any buff like: ZhongDu(poison), DongJie(frozen), etc
    // if buff, calculate effect and hp change
    // if died, "replace" from subTeam, then set next battler and break this loop
    // if lived, goon
    // fist end

    // second, get battle type, "atk" or "atk_skill"
    var atkSkillObj = formula.atkSkill(battlerObj.skill); // get triggered skill or null
    var skillId = 0;
    // if atk_skill, then set skillId
    if (!_.isEmpty(atkSkillObj)) {
      skillId = atkSkillObj.skill_id;
      atkType = "atk_skill";
    }
    // second end

    // third, get target who will be attacked
    atkeeIdxArray = formula.getTarget(battlerObj._index, atkeeForce.mainTeam, skillId);
    if (!!atkeeIdxArray && atkeeIdxArray.length == 0) {
      // no atkTarget means battle is over, then break;
      over = 1; // setup flag for battle over
      break; // stop loop
    }
    // third end

    stepResArray["atk"].push(
      {
        "group":  battlerObj._group,
        "index":  battlerObj._index,
      }
    );
    // fourth, calculate damage
    for (var j = 0; j < atkeeIdxArray.length; j++ ) {
      var k = atkeeIdxArray[j];

      console.log('-----204after----');
      console.log(atkeeForce.mainTeam[k]);

      var damage = formula.damage(battlerObj.atk, atkeeForce.mainTeam[k].def); // k must be same with atkeeTeam[k]._index !!!!!
      atkeeForce.mainTeam[k].hp += damage;  // damage is minus
      atkeeForce.unitLeftHP     += damage;  // damage is minus

      // reset current hp
      if (atkeeForce.mainTeam[k].hp < 0) {
        atkeeForce.mainTeam[k].hp = 0;
      }

      stepResArray["be_atk"].push(
        {
          "group":  atkeeForce.mainTeam[k]._group,
          "index":  atkeeForce.mainTeam[k]._index,
        }
      );
      stepResArray["change"].push(
        {
          "group":  atkeeForce.mainTeam[k]._group,
          "index":  atkeeForce.mainTeam[k]._index,
          "hp":     atkeeForce.mainTeam[k].hp,
          "hp_diff":damage
        }
      );
    }
    atkeeForce.skillCnt       += gameInit.BATTLE_INIT.SKILL_CNT;  // ++25
    
    roundResArray.push(
      {
        "round":    round,
        "turn":     turn,
        "sortIndex":sortIndex,
        //"attacker": atkerForce,
        //"attackee": atkeeForce,
        "atkerGroup": battlerObj._group,
        "atkeeSp":  atkeeForce.skillCnt,   
        "atkType":  atkType,
        "skill":    atkSkillObj,
        "data":     stepResArray
      }
    );

    //console.log('-----205----');
    //console.log(util.inspect(roundResArray, { showHidden: true, depth: null }));

    var replaceResArray = [];
    for (var m = 0; m < atkeeIdxArray.length; m++ ) {
      var n = atkeeIdxArray[m];
      if (atkeeForce.mainTeam[n].hp == 0) {
        if (!_.isEmpty(atkeeForce.subTeam)) { //subTeam may be [] if empty
          console.log('-----221, before replace----');
          console.log(util.inspect(atkeeForce, { showHidden: true, depth: null }));
          var idx = battleReplace(atkeeForce.mainTeam[n]._index, atkeeForce.mainTeam, atkeeForce.subTeam);
          console.log('-----222, after replace-----');
          console.log(util.inspect(atkeeForce, { showHidden: true, depth: null }));
          console.log(idx);
          if (idx > 0) {
            replaceResArray.push(
              {
                "group":  atkeeForce.mainTeam[n]._group,
                "index":  atkeeForce.mainTeam[n]._index,
                "back_index": idx
              }
            );
          }
        }
      }
    } // end of for loop

    //console.log('-----206----');
    //console.log(util.inspect(replaceResArray, { showHidden: true, depth: null }));
    if (!_.isEmpty(replaceResArray)) {
      atkType = "replace";
      roundResArray.push(
        {
          "round":    round,
          "turn":     turn,
          "sortIndex":sortIndex,
          //"attacker": atkerForce,
          //"attackee": atkeeForce,
          "atkType":  atkType,
          "data":     replaceResArray
        }
      );
      //console.log('-----207----');
      //console.log(util.inspect(roundResArray, { showHidden: true, depth: null }));
    }

    if (atkeeForce.unitLeftHP < 0) {
      atkeeForce.unitLeftHP = 0;
      over = 1;
    }
    else {
      var idx = i;
      if ( i >= gameInit.BATTLE_INIT.TEAM_PEOPLE) {
        idx -= gameInit.BATTLE_INIT.TEAM_PEOPLE;
      }
      
      // _group is in [1, 2]
      if (battlerObj._group == firstForce.groupIndex) {
        // first attacks second
        battlerObj = secondForce.mainTeam[idx]; // set next battlerObj, can this work??
      }
      else if (battlerObj._group == secondForce.groupIndex) {
        // second attacks first
        battlerObj = firstForce.mainTeam[idx]; // set next battlerObj, can this work??
      }
      sortIndex++;
    }
    // fourth end
  } // end of for

  return roundResArray;
};

// attackerData: unitForce(player data)
// attackeeData: unitForce(npc or other players)
// triky point: only process, no result here
battleBase.calc = function(attackerData, attackeeData) {
  var battleProcess = [];
  var firstForce;   // first attack
  var secondForce;  // second attack

  var isPlayerFirst = 0; // player first attack or not, 1: is, 0: not
  // copy from reformed data
  if (attackerData.unitAGI >= attackeeData.unitAGI) {
    firstForce  = battlerInit(attackerData, 1);     // _group for p1, p1 is fixed for player, _group is fixed in client side
    secondForce = battlerInit(attackeeData, 2);     // _group for p2, p2 is fixed for attackee in client side
    isPlayerFirst = 1; // is player first attack
  }
  else {
    firstForce  = battlerInit(attackeeData, 1);
    secondForce = battlerInit(attackerData, 2);
  }

  var turn  = 1;
  var win   = 0; // 1: player won, 0: player lose
  var over  = 0; // 1: battle over, 0: battle go on
  var btkDetail = {};
  for ( turn; turn <= gameInit.BATTLE_INIT.MAX_TURN; turn++) {
    if (over) {
      break; // break the turn "for"
    }

    if (isPlayerFirst) {
      battleProcess.push({
        "turnPrepare":  1,
        "turn": turn,
        "data": battleQueue(firstForce, secondForce)
      });
    }
    else {
      battleProcess.push({
        "turnPrepare":  1,
        "turn": turn,
        "data": battleQueue(secondForce, firstForce)
      });
    }

    var round = (turn - 1) * gameInit.BATTLE_INIT.ROUND_IN_TURN + 1;

    // t, m is only short symbols 
    var t = turn * gameInit.BATTLE_INIT.ROUND_IN_TURN;
    var m = gameInit.BATTLE_INIT.MAX_ROUND;
    var roundMax = (t <= m) ? t : m;

    for (round; round <= roundMax; round++) {
      btlDetail = battleRound(firstForce, secondForce, turn, round);

      if (isPlayerFirst) {
        battleProcess.push({
          "round":  round,
          "turn":   turn,
          //"attacker": firstForce,
          //"attackee": secondForce,
          "data":     btlDetail
        });
      } 
      else {
        battleProcess.push({
          "round":  round,
          "turn":   turn,
          //"attacker": secondForce,
          //"attackee": firstForce,
          "data":     btlDetail
        });
      }
      
      // check battle over or not
      over = isBattleOver(firstForce, secondForce, round);
      if (over) {
        winner = battleWinner(firstForce, secondForce);
        if (winner) {
          btlDetail = { "winner": winner };
          battleProcess.push({
            "battleOver":  1,
            "turn": turn,
            "data":     btlDetail
          });
        }
        break; // break the round "for" loop
      }
    } //end the round "for" loop
  } //end the turn "for" loop
  
  //console.log(util.inspect(battleProcess, { showHidden: true, depth: null }));
  return battleProcess;  
};
