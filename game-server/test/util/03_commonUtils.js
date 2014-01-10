var should = require('should');
var commonUtils = require('../../../shared/util/commonUtils');
var gameInit = require('../../../shared/gameInit');
var DBCONF  = require('../../../shared/dbconf');

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

var obj2 = {
  "type": "super",
  "id":   202
};
  describe('getInitID test', function() {
    it('should get id', function() {
      var res = commonUtils.getInitID(gameInit.TRANSMISSION, obj2.type);
      res.should.equal(obj2.id);
    });
  });

  describe('masterDBW test', function() {
    it('should get master dbhandle', function() {
      var res = commonUtils.masterDBW();
      res.should.equal(DBCONF.GAME_MASTER_W);
    });
  });

  describe('masterDBR test', function() {
    it('should get slave dbhandle', function() {
      var res = commonUtils.masterDBR();
      res.should.equal(DBCONF.GAME_MASTER_R);
    });
  });

  describe('masterDBW test', function() {
    it('should get backup dbhandle', function() {
      var res = commonUtils.masterDBB();
      res.should.equal(DBCONF.GAME_MASTER_B);
    });
  });

