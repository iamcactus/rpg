/*
var sl = function(lv) {
  return Math.floor(lv / 10) + 1;
}

var lv = 1;
console.log(sl(lv));

*/
var _ = require('underscore');

var getTarget = function(tempArray, positionId, playerForce) {
  // atk
  for (var i in tempArray) {
    var k = tempArray[i];
    for (var j in playerForce) {
      if ((playerForce[j].position == k) && !!playerForce[j].player_card_id) {
        return k;
      }
    }
  }
}

var getSkillTarget = function(positionId, playerForce, skillId) {
  var arrays = {
    1:  [1,2,3,4],
    2:  [2,3,4,1],
    3:  [3,4,1,2],
    4:  [4,1,2,3]
  };

  var target = [];
  if (skillId == 1) { //
    var t = getTarget(arrays[positionId], positionId, playerForce);
    console.log(t);
    target.push(t);
  }
  else if (skillId == 2) { //
    var t1 = getTarget(arrays[positionId], positionId, playerForce);
    target.push(t1);
    var tempArray = _.without(arrays[positionId], t1);
    var t2 = getTarget(tempArray, positionId, playerForce);
    if (t2) {
      target.push(t2);
    }
  }
  else if (skillId == 4) { //
    var a = [1,2,3,4];
    for (var i in a) {
      for (var j in playerForce) {
        if ((playerForce[j].position == a[i]) && !!playerForce[j].player_card_id) {
          target.push(a[i]);
        }
      }
    }
  }

  return target;
};

var playerForce = [
  {
    "position":2,
    "player_card_id":13
  },
  {
    "position":4,
    "player_card_id":13
  },
  {
    "position":5,
    "player_card_id":15
  },
  {
    "position":6,
    "player_card_id":16
  },
  {
    "position":7,
    "player_card_id":17
  }
];

console.log(getSkillTarget(1, playerForce, 1));
console.log(getSkillTarget(2, playerForce, 2));
console.log(getSkillTarget(3, playerForce, 4));
console.log(getSkillTarget(4, playerForce, null));
