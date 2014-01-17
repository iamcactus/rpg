// battle three steps:
// battle step 1) prepare (battle preparation)
// battle step 2) turn (battle turn)
// battle step 3) win (battle result)

var fs = require('fs');
var async = require('async');
var mysql = require('mysql');
var util = require('util');
var _ = require('underscore');

var npcUnitAllData = require('../../dao/union/npcUnitAllData');
var playerUnitAllData = require('../../dao/union/playerUnitAllData');
var Player    = require('../../domain/Player');
var formula   = require('../../util/formula');
var dataApi   = require('../../util/dataApi');
var utils     = require('../../util/utils');
var gameInit  = require('../../../../shared/gameInit');
var commonUtils = require('../../../../shared/util/commonUtils');
var battleBase  = require('./battleBase');

var battleAllData = module.exports;

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

    var battleProcess = [];
    var battleReport = {};

    //console.log(results);
    var attackerData = battleBase.unitForce(results.attackerData);
    var attackeeData = battleBase.unitForce(results.attackeeData);

    var report = {};
    report["prepare"] = battleBase.prepare(
      results.attackerData,
      attackerData,
      results.attackeeData,
      attackeeData
    );

    battleProcess = battleBase.calc(attackerData, attackeeData);

    var queueRound = [0, 0, 0];
    var curRound = 0;
    var isSetRound = 0;
    var curTurn  = 1;
    var isSetTurn = 0;
    var curSortIndex = 0;

    var p1_sp = 0; // player's pet skill point
    var p2_sp = 0; // atkee's pet skill point

    for (var i = 0; i < battleProcess.length; i++) {
      var j = battleProcess[i].turn;
      if (j > curTurn) { // init flag
        isSetRound  = 0;
        isSetTurn   = 0;
        curSortIndex  = 0;
        curTurn     = j;
      }
      if (typeof report[j] == 'undefined') {
        report[j] = [];
      }
      if (isSetTurn == 0) {
        if (!!battleProcess[i].turnPrepare) {
          report[j].push(battleProcess[i].data);
          report[j].push({
            "type":       "turn",
            "sort_index": -1,
            "data":     {"turn": battleProcess[i].turn}  
          });
          isSetTurn = 1;
        }
      }
      if (!!battleProcess[i].round) {
        if (battleProcess[i].round == curRound) {
        }
        else if (battleProcess[i].round > curRound) {
          curRound = battleProcess[i].round;
          report[j].push({
            "type":       "round",
            "sort_index": -1,
            "data":     {"round": battleProcess[i].round}  
          });
        }
        for (var m = 0; m < battleProcess[i].data.length; m++) {
          var temp = battleProcess[i].data;
          var data = temp[m].data;
          if (temp[m].atkeeGroup == 1) {
            p1_sp = temp[m].atkeeSp;
          }
          else if (temp[m].atkeeGroup == 2) {
            p2_sp = temp[m].atkeeSp;
          }
          data["p1_sp"] = p1_sp; 
          data["p2_sp"] = p2_sp;

          // type "atk_skill"
          if (!_.isEmpty(temp[m].skill)) {
            var d = temp[m].data;
            d["skill_id"] = temp[m].skill.skill_id;
            d["skill_lv"] = temp[m].skill.skill_lv;
            report[j].push({
              "type":       temp[m].atkType,
              "sort_index": temp[m].sortIndex,
              "data":       data
            });
          }
          else {
          // type "atk"
            report[j].push({
              "type":       temp[m].atkType,
              "sort_index": temp[m].sortIndex,
              "data":       data
            });
          }
        }
      } // end of if (!!battleProcess[i].round)
      if (!!battleProcess[i].battleOver) {
        if (attackerData.playerId === battleProcess[i].data.winner) {
          report["win"] = 1;
        }
        else if (attackeeData.playerId === battleProcess[i].data.winner) {
          report["win"] = 0;
        }
      }
    } // end of for loop

    console.log('------------');
    console.log('------------');
    console.log('------------');
    console.log('------------');
    fs.writeFile("text.txt", util.inspect(report, { showHidden: true, depth: null }), function(e) {
      if (e) {
        console.log('error in writing file');
      }
    });

    //console.log(util.inspect(report, { showHidden: true, depth: null }));
    utils.invokeCallback(cb, null, report);
    return;
  });
}
