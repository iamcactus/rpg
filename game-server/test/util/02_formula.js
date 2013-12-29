var should = require('should');
var formula = require('../../app/util/formula');

describe('formular test', function() {
  it('should getTarget array as:', function() {
    for (var i in firstForce) {
      var t = firstForce[i]._index;
      var atkeeIdxArray = formula.getTarget(t, secondForce, 0);
      var tgtArray = target[t];
      console.log(atkeeIdxArray);
      console.log(tgtArray);
      atkeeIdxArray.should.eql(tgtArray);
    }
  });

  it('should get skillTarget array as:', function() {
    for (var i in firstForce) {
      var t = firstForce[i]._index;
      var atkeeIdxArray = formula.getTarget(t, secondForce, 3009);
      var tgtArray = skillTarget[t];
      console.log(atkeeIdxArray);
      console.log(tgtArray);
      atkeeIdxArray.should.eql(tgtArray);
    }
  });

});

var skillTarget = {
  0:  [0, 3],
  1:  [3, 0],
  2:  [3, 0],
  3:  [3, 0]
};

var target = {
  0:  [0],
  1:  [3],
  2:  [3],
  3:  [3]
};

var firstForce = [
  {
    "_index":0,
    "card_id":11
  },
  {
    "_index":1,
    "card_id":12
  },
  {
    "_index":2,
    "card_id":13
  },
  {
    "_index":3,
    "card_id":14
  }
];

var secondForce = [
  {
    "_index":0,
    "card_id":13
  },
  {
    "_index":3,
    "card_id":13
  }
];

