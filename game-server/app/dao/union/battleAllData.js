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

var battleAllData = module.exports;

// both created by NPCgenerator.js
// conf
var TURNMAX   = 3;
var ROUNDMAX  = 10;
var ROUNDINTURN = 5;
var MAXMEMBER = 4;
var SKILLCNT  = 25;

var unitForce = function(unitAllData) {
  if (!unitAllData) {
    return null;
  }
  var playerCard  = unitAllData.playerCard;   // player_card
  var playerEquip = unitAllData.playerEquip;  // player_equip
  var playerPet   = unitAllData.playerPet;    // player_pet
  var playerMeridian  = unitAllData.playerMeridian; // unit_meridian
  var playerUnit = unitAllData.playerUnit; // player_unit

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
    var weaponObj   = {};
    var defenderObj = {};
    var shoeObj     = {};
    var jewelryObj  = {};
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
    
    for (var j in playerEquip) {
      if (playerEquip[j].id == weapon_sid) {
        weaponObj["equip_id"] = playerEquip[j].equip_id;
        weaponObj["level"]    = playerEquip[j].level;
      }
      else if (playerEquip[j].id == defender_sid) {
        defenderObj["equip_id"] = playerEquip[j].equip_id;
        defenderObj["level"]    = playerEquip[j].level;
      }
      else if (playerEquip[j].id == shoe_sid) {
        shoeObj["equip_id"] = playerEquip[j].equip_id;
        shoeObj["level"]    = playerEquip[j].level;
      }
      else if (playerEquip[j].id == defender_sid) {
        jewelryObj["equip_id"]  = playerEquip[j].equip_id;
        jewelryObj["level"]     = playerEquip[j].level;
      }
    }

    for (var k in playerMeridian) {
      if (playerMeridian[k].player_card_id == card_sid) {
        var mType = formula.stoneType(playerMeridian[k].stone_id);
        meridianObj[mType] = playerMeridian[k].stone_id;
      }
    }
    console.log(meridianObj);
    /*
    console.log("weaponObj");
    console.log(weaponObj);
    console.log("defenderObj");
    console.log(defenderObj);
    console.log("shoeObj");
    console.log(shoeObj);
    console.log("jewelryObj");
    console.log(jewelryObj);
    */

    // YuanShi ShuXing
    var origForce         = formula.origForce(cardObj.card_id, cardObj.level);

    // JinHua FuJia
    var evolveAddon       = formula.evolveAddon(cardObj.card_id, cardObj.evolved_cnt);

    // ZhuangBei ShuXing
    var weaponOrigForce   = formula.equipOrigForce(weaponObj.equip_id, weaponObj.level); 
    var defenderOrigForce = formula.equipOrigForce(defenderObj.equip_id, defenderObj.level); 
    var shoeOrigForce     = formula.equipOrigForce(shoeObj.equip_id, shoeObj.level); 
    var jewelryOrigForce  = formula.equipOrigForce(jewelryObj.equip_id, jewelryObj.level); 
    // ZhuangBei FuHe
    var weaponAddon   = formula.equipAddon(weaponObj.equip_id, cardObj.card_id);
    var defenderAddon = formula.equipAddon(defenderObj.equip_id, cardObj.card_id);
    var shoeAddon     = formula.equipAddon(shoeObj.equip_id, cardObj.card_id);
    var jewelryAddon  = formula.equipAddon(jewelryObj.equip_id, cardObj.card_id);

    //console.log("weaponOrigForce:" + weaponOrigForce + " ,defenderOrigForce:" + defenderOrigForce + " ,shoeOrigForce:" + shoeOrigForce + " ,jewelryOrigForce:" + jewelryOrigForce);
    //console.log("weaponAddon:" + weaponAddon + " ,defenderAddon:" + defenderAddon + " ,shoeAddon:" + shoeAddon + " ,jewelryAddon:" + jewelryAddon);

    // ZuHe JiaCheng
    var natureAddon   = formula.natureAddon(
      cardIds,
      [weaponObj.equip_id, defenderObj.equip_id, shoeObj.equip_id, jewelryObj.equip_id],
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

    var skill = {
      "s1":   { "skill_id": cardObj.data.skill_k,
                "skill_lv": formula.skillLevel(cardObj.level)
              }
    }

    force.push(
      {
        "player_card_id":   playerUnit[i].player_card_id,
        "position":         playerUnit[i].position_id,
        "card_id":          cardObj.card_id,
        "card_level":       cardObj.level,
        "card_star":        cardObj.data.star,
        "card_skill":       skill,
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
var battlePrepare = function(playerAllData1, playerForce1, playerAllData2, playerForce2) {
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

/*
var battler = function(playerForce) {
  var t = {};

  t = _.extend(t, playerForce);

  for (var i in t) {
    if (!playerForce[i]) {
      continue;
    }
    if (playerForce1[i].position < 5 && playerForce1[i].position > 0) {
        p["_group"]  = 1;
        p1.push(p);
      }
      else if (playerForce1[i].position < 9 && playerForce1[i].position > 4) {
        p["_group"]  = 2;
        p1Back.push(p);
      }
  }
  
  return t;
}
*/

// battle step 2) turn (battle turn) for type "queue"
// playerForce1: attacker
// playerForce2: attackee ( be attacked )

// temp obj during battle calculation
var attacker = {}; 
var attackee = {};

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
        indx -= MAXMEMBER;
        p["_index"]  = indx;
        p["_group"]  = groupId ;
        subTeam[indx] = p;
      }
    }
  }

  //console.log('-------105-------');
  //console.log(mainTeam);
  //console.log(subTeam);

  // skillCnt: skill count down
  return {
    "playerId": playerForce.playerId,
    "unitAGI":  playerForce.unitAGI,
    "unitLeftHP":   playerForce.unitLeftHP,
    "mainTeam": mainTeam,
    "subTeam":  subTeam,
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

// 1: is over, 0: opposite
var isBattleOver = function(firstForce, secondForce) {
  if (!!firstForce && !!secondForce) {
    if (firstForce.unitLeftHP < 1 || secondForce.unitLeftHP < 1) {
      return 1;
    }
  }
  return 0;
}

// firstForce: who first attack (higher AGI)
// secondForce: who second attack (lower AGI)
// @returns {Boolean} 1: firstForce win, 0: secondForce win
var isBattleWin = function(firstForce, secondForce) {
  var res = 0;
  console.log('------102-----');
  console.log(firstForce.unitLeftHP);
  console.log(secondForce.unitLeftHP);

  if (!!firstForce.unitLeftHP) {
    if (!!secondForce.unitLeftHP) {
      var t = firstForce.unitLeftHP - secondForce.unitLeftHP;
      res = (t > 0) ? 1 : 0;
    }
    else {
      res = 1;
    }
  }
  return res;
}

var battlerPulse = function(playerForceCard, sortIndex) {
  if (!!playerForceCard && !!playerForceCard.pulse) { // pet_skill_effect, like zhongdu/lengdong
  // show pet_skill_effect
    return {
      "type": playerForceCard.pulse,
      "sort_index": sortIndex,
      "data": {}
    };
  }
}

var battleDetail = function(firstForce, secondForce, battlerIndex, sortIndex) {
  var data      = {}; // for type "data"
  var repo = []; 

  var dataBeAtk = []; // for "data" -> "be_atk"
  var dataAtk   = []; // for "data" -> "atk"
  var dataChange= []; // for "data" -> "change"
  var atkType   = "atk"; // atk or atk_skill or ...

console.log('---161----');
console.log(firstForce.mainTeam[battlerIndex]);

  if (!firstForce.mainTeam || !firstForce.mainTeam[battlerIndex]) {
    return;
  }

  // replace
  if (firstForce.mainTeam[battlerIndex].hp < 1) {
console.log('---162----');
console.log(firstForce);
    if (!!firstForce.subTeam) {
      var replaceIndex = formula.replaceIndex(firstForce.subTeam);
console.log('---163----');
console.log(replaceIndex);
      if (replaceIndex > 0) {
console.log('---164----');
console.log(firstForce);

        var indx  = firstForce.mainTeam[battlerIndex]._index;
        var grp   = firstForce.mainTeam[battlerIndex]._group;
 
        // insert the card from subteam into mainteam
        delete firstForce.mainTeam[battlerIndex];
        firstForce.mainTeam[battlerIndex] = firstForce.subTeam[replaceIndex];
        // delete the card from subteam
        //firstForce.subTeam.splice(replaceIndex, 1);
        delete firstForce.mainTeam[battlerIndex];

        firstForce.mainTeam[battlerIndex]._index = indx;
        firstForce.mainTeam[battlerIndex]._group = grp;
console.log('---165----');
console.log(firstForce);
        // make report
        repo.push({
          "group":  firstForce.mainTeam[battlerIndex]._group,
          "index":  firstForce.mainTeam[battlerIndex]._index
        });
        return {
            "type": "replace",
            "sort_index": sortIndex,
            "data": repo
        };
      }
    }
    repo.push({
      "group":  firstForce.mainTeam[battlerIndex]._group,
      "index":  firstForce.mainTeam[battlerIndex]._index
    });
    // delete the card from mainTeam
    //firstForce.mainTeam.splice(battlerIndex, 1);
    delete firstForce.mainTeam[battlerIndex];
    // no replacement
console.log('---166----');
console.log(util.inspect(firstForce, { showHidden: true, depth: null }));
    return {
      "type": "delete",
      "sort_index": sortIndex,
      "data": repo
    };
  }

  var firstForceCard = firstForce.mainTeam[battlerIndex];
  var atkSkillObj = formula.atkSkill(firstForceCard.skill); // get triggered skill or null

  var skillId;
  if (!!atkSkillObj) {
    skillId = atkSkillObj.skill_id;
  }

  //console.log('-----110------');
  //console.log(firstForceCard._index);
  skillId = 0;
  // atkTarget: array of index
  atkTarget = formula.getTarget(firstForceCard._index, secondForce.mainTeam, skillId);
  console.log('-----109------');
  console.log(atkTarget);

/*
      // type: atk_skill
 if (atkSkillObj) {
   for (var j in atkTarget) {
     for (var k in secondForce) {
       if (secondeFoce[k].position == j) {
         var skillDamage = formula.skillDamage(atkSkillObj.skill_id, firstForce[i].atk, secondFoce[k].def);
         atkData.push(
           {
             "group":  formula.unitGroupId(secondForce[k].["_group"],
             "index":  secondForce[k].["_index"],
             "hp":     secondForce[k].org_hp,
             "hp_diff":  skillDamage
           }
         );
       }
     }
   }
 }
 // type: atk 
 else {
*/
  var t = atkTarget["targetOneIndex"];
  if (!t) {
    // battle over cauz no battle target
    console.log('----------201-battleOver-------');
    return {
      "done":1
    };
  }

  dataAtk.push(
    {
      "group": firstForceCard._group,
      "index": firstForceCard._index
    }
  );

  console.log('-------110-------');
  console.log(secondForce.mainTeam);

  dataBeAtk.push(
    {
      "group":  secondForce.mainTeam[t]._group,
      "index":  secondForce.mainTeam[t]._index
    }
  );


  var damage = formula.damage(firstForceCard.atk, secondForce.mainTeam[t].def);
  secondForce.skillCnt += SKILLCNT;     // ++25
  secondForce.mainTeam[t].hp += damage; // damage is minus
  secondForce.unitLeftHP += damage;     // damage is minus 

console.log('---167----');
console.log(util.inspect(secondForce, { showHidden: true, depth: null }));

  if (secondForce.mainTeam[t].hp < 0) {
    secondForce.mainTeam[t].hp = 0;
  }

  if (secondForce.unitLeftHP < 0) {
    secondForce.unitLeftHP = 0;
  }

  dataChange.push(
    {
      "group":  secondForce.mainTeam[t]._group,
      "index":  secondForce.mainTeam[t]._index,
      "hp":     secondForce.mainTeam[t].hp,
      "hp_diff":  damage
    }
  );

  data["atk"] = dataAtk;
  data["be_atk"] = dataBeAtk;
  data["change"] = dataChange;
  //console.log(util.inspect(data, { showHidden: true, depth: null }));

  return {
    "type": atkType,
    "sort_index": sortIndex,
    "data": data,
    "p1_sp":  firstForce.skillCnt,
    "p2_sp":  secondForce.skillCnt
  };
 //} // end of else
 //}
/*
        var isDodge = 0;
        // dodge(ShanBi) or not
        if (formula.stoneEffect(secondForce[i].dodge) {
          // hit(MingZhong) or not
          if (formula.stoneEffect(firstForce[i].hit) {
            // set hit as stone effect
          }
          else {
            // set dodge as stone effect
            isDodge = 1;
          }
        }
        if (!isDodge) {
          // crit(BaoJi) or not
          if (formula.stoneCrit(secondForce[i].dodge) {
            // hit(MingZhong) or not
            if (formula.stoneEffect(firstForce[i].hit) {
              // set hit as stone effect
            }
            else {
              // set dodge as stone effect
              isDodge = 1;
            }
          }
                  
            var data = {
              "atk":    atker,
              "be_atk": atkTarget,
              "change": atkData
            }
            turnReport.push(
              {
                "type": "atk",
                "sort_index": sortIndex,
                "data": data,
                "p1_sp": p1Sp,
                "p2_sp": p2Sp
              }
            );
          }
*/
};

// battle step 2) turn (battle turn) for type "atk", "atk_skill"
// firstForce's AGI >= secondForce's AGI
// should be insured by the caller
// battle round. 5 round in 1 turn, 10 round at most

var battleRound = function(firstForce, secondForce, turn, round) {
  var turnReport = [];

  var win;

  if (round <= ROUNDMAX) {
    turnReport.push(
      {
        "type": "round",
        "sort_index": -1,
        "data": { "round": round }
      }
    );

    // sort all teams

    // atk, atk_skill, pet_atk_skill

    var sortIndex = 0;
    var tempLength = 4;
    for (var i = 0; i < 4; i++) {
      // sort
  
      // replace
      console.log("---111----");
      //console.log(firstForce);
      
      var battleDetailReport;
      /*
      if (petBattle) {
        battleDetail = petBattleDetail(firstForce.pet, secondForce);
      }
      */

      var battlerPulseReport = battlerPulse(firstForce.mainTeam[i], sortIndex);
      if (!!battlerPulseReport) {
        turnReport.push(battlerPulseReport);
      }

      battleDetailReport = battleDetail(firstForce, secondForce, i, sortIndex);
      if (!!battleDetailReport) {
        turnReport.push(battleDetailReport);
        var win = isBattleOver(firstForce, secondForce); // 1 or 0
        if (win) {
          return turnReport;
        }
      }
      else {
        continue;
      }
      
      sortIndex++;

      battlerPulseReport = battlerPulse(secondForce.mainTeam[i], sortIndex);
      if (!!battlerPulseReport) {
        turnReport.push(battlerPulseReport);
      }

      battleDetailReport = battleDetail(secondForce, firstForce, i, sortIndex);

      if (!!battleDetailReport) {
        turnReport.push(battleDetailReport);
        var win = isBattleOver(firstForce, secondForce); // 1 or 0
        if (win) {
          return turnReport;
        }
      }
      else {
        continue;
      }
    }
  }
  return turnReport;
};

var battleTurn = function(firstForce, secondForce, turn) {
  var report = {};

  var round = (turn - 1) * ROUNDINTURN + 1;
  if (turn < TURNMAX) {
    // turn 1: round 1-5, turn 2: rount 6-10
    var turnReport = [];
    turnReport.push(battleQueue(firstForce, secondForce));
    turnReport.push(
      {
        "type": "turn",
        "sort_index": -1,
        "data": { "turn": turn }
      }
    );
    
    while (round <= (turn * ROUNDINTURN) && round <= ROUNDMAX) {
      console.log('---103-------');
      console.log(round);

      var win = isBattleOver(firstForce, secondForce); // 1 or 0
      if (win) {
        break;
      }

      var battleRoundRep = battleRound(firstForce, secondForce, turn, round);
      /*
      var battleRoundRep = {
        "type": "test",
        "sort_index": -1,
        "data": { "round": round}
      };
      */
      turnReport.push(battleRoundRep);
      round++;
    }

    report.turn = turnReport;
  }
  //console.log(util.inspect(report, { showHidden: true, depth: null }));
  return report;
};

battleAllData.calc = function(mysqlc, playerId, attackeeId, cb) {
  async.auto({
    attackerData: function(callback) {
      playerUnitAllData.get(mysqlc, playerId, function(err, res) {
        if (!!err || !res) {
          console.log('Get player data failed!');
          console.log(err);
        }
        callback(err, res);
      });
    },
    attackeeData: function(callback) {
      playerUnitAllData.get(mysqlc, attackeeId, function(err, res) {
        if (!!err || !res) {
          console.log('Get attackee data failed!');
          console.log(err);
        }
        callback(err, res);
      });
    }
  }, function(err, results) {
    if (!!err || !results) {
      console.log('data prepare failed!');
      console.log(err);
      utils.invokeCallback(cb, err, null);
      return;
    }

    //console.log(results);
    var attackerForce = unitForce(results.attackerData);
    var attackeeForce = unitForce(results.attackeeData);
    //console.log(npcForce);
    //console.log(playerForce);
    var prepare = battlePrepare(results.attackerData, attackerForce, results.attackeeData, attackeeForce);

    var battleRes = {};
    var firstForce;
    var secondForce;
    if (attackerForce.unitAGI >= attackeeForce.unitAGI) {
      firstForce  = battlerInit(attackerForce, 1);     // _group for p1
      secondForce = battlerInit(attackeeForce, 2);  // _group for p2
    }
    else {
      firstForce  = battlerInit(attackeeForce, 1);
      secondForce = battlerInit(attackerForce, 2);
    }
    
    var report = {};
    report["prepare"] = prepare;

    for ( i = 0; i < TURNMAX; i++) {
      var turn = i + 1;
      if (turn == TURNMAX) {
        report[turn] = [];
        break;
      }
      else {
        var win = isBattleOver(firstForce, secondForce); // 1 or 0
        if (win) {
          break;
        }

        battleRes = battleTurn(firstForce, secondForce, turn);
        report[turn] = battleRes;
      }
      console.log(battleRes);
    }
    
    var win = isBattleWin(firstForce, secondForce); // 1 or 0
    if (win) {
      report["win"] = firstForce.playerId;
    }
    else {
      report["win"] = secondForce.playerId;
    }

    console.log(util.inspect(report, { showHidden: true, depth: null }));
    
    utils.invokeCallback(cb, null, report);
  });
}
