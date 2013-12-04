var should = require('should');
var commonUtils = require('../../../shared/util/commonUtils');

var a = {
  1       : 1,
  ''      : 0, 
  12345678:12345678, 
  0       : 0, 
  '0.1'   : 0, 
  '-1'    : -1, 
  '-10'   : -10, 
  '004a'  : 4, 
  'asfa123' : 0,
  'asdf'    : 0
};

  describe('parseNumber test', function() {
    it('should return true', function() {
      for (var k in a) {
        var res = commonUtils.parseNumber(k);
        res.should.equal(a[k]);
      }
    });
  });