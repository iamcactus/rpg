var should = require('should');
var commonUtils = require('../../../shared/util/commonUtils');

var isNG = {
  0         : true,
  '18禁'    : true, 
  '118禁美人' : true
};

var notNG = {
  10      : false,
  'あのね'  : false, 
  'lv'    : false, 
  '001halo' : false, 
  'HASH'    : false,
  '人'      : false, 
  '1234567890あのね'  : false, 
  '1234567890美人'    : false,
  '1234567890ラブ'    : false,
  'セク1234567890'    : false
};

  describe('isNGWord test', function() {
    it(' isNG should pass each check', function() {
      for (var k in isNG) {
        var res = commonUtils.isNGWord(k);
        res.should.be.true;
      }
    });
  });

  describe('isNGWord test', function() {
    it(' notNG should pass each check', function() {
      for (var k in notNG) {
        var res = commonUtils.isNGWord(k);
        res.should.be.false;
      }
    });
  });
