var should = require('should');
var formula = require('../../app/util/formula');

describe('formular test', function() {
  it('should calculate equipPrice', function() {
    var equipId = 5201;
    var level   = 10;
    var price  = formula.equipPrice(level, equipId);

    price.should.eql(496);
  });
});
