var should = require('should');
var formula = require('../../app/util/formula');

describe('formular test', function() {
  it('level should be up as:', function() {

    for (var i in expList) {
      var t = expList[i].expObj;
      var newLv = formula.cardLevelUp(t.initExp, t.addOnExp, t.initLv, t.maxLv);
      console.log(newLv);
      newLv.should.eql(expList[i].newLv);
    }
  });
});

var expList = {
  "1":  "comment: star 1 no lv up",
  "1": {
    expObj:  {
      initExp:  0,
      initLv:   1,
      addOnExp: 20,
      maxLv:    15,
    },
    newLv: 1
  },
  "2":  "comment: star 1 one lv up",
  "2":  {
    expObj:  {
      initExp:  0,
      initLv:   1,
      addOnExp: 69,
      maxLv:    15,
    },
    newLv: 3
  },
  "3":  "comment: star 1 more lv up but come with maxLv",
  "3":  {
    expObj:  {
      initExp:  1201,
      initLv:   9,
      addOnExp: 10000,
      maxLv:    15,
    },
    newLv: 15
  },
  "4":  "comment: star 5 more lv up",
  "4":  {
    expObj:  {
      initExp:  1201,
      initLv:   9,
      addOnExp: 30000,
      maxLv:    35,
    },
    newLv: 21
  },
  "5":  "comment: star 5 more lv up but come with maxLv",
  "5":  {
    expObj:  {
      initExp:  1200,
      initLv:   9,
      addOnExp: 213800,
      maxLv:    35,
    },
    newLv: 35
  },
  "6":  "comment: star 2 more lv up but come with maxLv",
  "6":  {
    expObj:  {
      initExp:  1200,
      initLv:   9,
      addOnExp: 50000,
      maxLv:    20,
    },
    newLv: 20
  },
  "7":  "comment: star 3 more lv up but come with maxLv",
  "7":  {
    expObj:  {
      initExp:  1201,
      initLv:   9,
      addOnExp: 70000,
      maxLv:    25,
    },
    newLv: 25
  },
};
