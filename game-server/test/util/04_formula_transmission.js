var should = require('should');
var formula = require('../../app/util/formula');

describe('formular test', function() {
  it('exp should transmitted as:', function() {

    for (var i in transmissions) {
      var t = transmissions[i].transferObj;
      var transmission = formula.transmission(t.typeId, t.transNum, t.transferExp);
      transmission.should.eql(transmissions[i].receiverExp);
    }
  });
});

var transmissions = {
  "1":  "comment: normal but less then basicExp",
  "1": {
    transferObj:  {
      typeId:   201,
      transNum: 1,
      transferExp: 5000,
    },
    receiverExp: 3000
  },
  "2":  "comment: normal but more then basicExp",
  "2":  {
    transferObj:  {
      typeId:   201,
      transNum: 2,
      transferExp: 12344,
    },
    receiverExp: 7407
  },
  "3":  "comment: super but less then basicExp",
  "3":  {
    transferObj:  {
      typeId:   202,
      transNum: 1,
      transferExp: 5000,
    },
    receiverExp: 4000
  },
  "4":  "comment: super but more then basicExp",
  "4":  {
    transferObj:  {
      typeId:   202,
      transNum: 2,
      transferExp: 100000,
    },
    receiverExp: 64420 // 80525 * 0.8
  }
};
