var should = require('should');
var formula = require('../../app/util/formula');

describe('formular test', function() {
  it('equip level should be up as:', function() {

    for (var i in equipList) {
      var t = equipList[i].expObj;
      var cost = formula.equipLvUpCost(t.initLv, t.targetLv, t.star); 
      console.log(cost);
      cost.should.eql(equipList[i].cost);
    }
  });
});

var equipList = {
  "1":  "comment: star 1, 200 lv up",
  "1": {
    expObj:  {
      initLv: 1,
      targetLv: 201,
      star:   1,
      maxLv:  200,
    },
    cost: -1
  },
  "2":  "comment: star 2, 5 lv up",
  "2":  {
    expObj:  {
      initLv: 1,
      targetLv: 6,
      star:   2,
      maxLv:  200,
    },
    cost: 210
  },
  "3":  "comment: star 3, 10 lv up",
  "3":  {
    expObj:  {
      initLv: 50,
      targetLv: 60,
      star:   3,
      maxLv:  200,
    },
    cost: 210935
  },
  "4":  "comment: star 4, 10 lv up",
  "4":  {
    expObj:  {
      initLv: 60,
      targetLv: 70,
      star:   4,
      maxLv:  200,
    },
    cost: 441866
  },
  "5":  "comment: star 5 more lv up but come with maxLv",
  "5":  {
    expObj:  {
      initLv: 60,
      targetLv: 70,
      star:   5,
      maxLv:  200,
    },
    cost: 552331
  }
};
