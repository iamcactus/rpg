var should = require('should');
var commonUtils = require('../../../shared/util/commonUtils');
var gameInit = require('../../../shared/gameInit');

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

var obj = {
  "type": "general",
  "id":   101
};
  describe('getInitID test', function() {
    it('should get id', function() {
      var res = commonUtils.getInitID(gameInit.BAG, obj.type);
      res.should.equal(obj.id);
    });
  });


