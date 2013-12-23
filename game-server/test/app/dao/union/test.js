/*
var sl = function(lv) {
  return Math.floor(lv / 10) + 1;
}

var lv = 1;
console.log(sl(lv));

*/

var getTarget = function(positionId, playerForce, skill) {
  var target = [];
  var arrays = {
    1:  [1,2,3,4],
    2:  [2,3,4,1],
    3:  [3,4,1,2],
    4:  [4,1,2,3]
  };

  var tempArray = arrays[positionId];

  if (skill) {
  // atk_skill
    if (skill == 1) { //

    }
    else if (skill == 2) { //

    }
    else if (skill == 4) { //

    }
  }
  else {
  // atk
    for (var i in tempArray) {
      var k = tempArray[i];

      for (var j in playerForce) {
        if ((playerForce[j].position == k) && playerForce[j].player_card_id) {
          targetId = k;
          return targetId;
        }
      }
    }
  }
}

var playerForce = [
  {
    "position":3,
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

console.log(getTarget(1, playerForce, null));
console.log(getTarget(2, playerForce, null));
console.log(getTarget(3, playerForce, null));
console.log(getTarget(4, playerForce, null));
