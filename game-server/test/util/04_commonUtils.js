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


// test for getObj
var playerEquip = [
  { id: 2609, player_id: 2020, equip_id: 5109, level: 10 },
  { id: 2610, player_id: 2020, equip_id: 5101, level: 10 }
];

  describe('getObj test', function() {
    it(' should get', function() {
      var key = 'id';
      for (var k in playerEquip) {
        var res = commonUtils.getObj(playerEquip, key, playerEquip[k][key]);
        res.should.eql(playerEquip[k]);
      }
    });
  });
