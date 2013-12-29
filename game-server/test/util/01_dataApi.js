var should = require('should');
var api = require('../../app/util/dataApi');
var alpha = require('../../../shared/cardConf');

describe('JSON data api test', function() {
  var map = api.map;

  it('should get equip ids', function() {
    var equipId = '5101';
    var item = api.equip.findBy('equip_id', equipId);
    var s = item.initial;
    var t = 51; // game_master.equip_data.equip_id whith equip_id = 2504
    s.should.eql(t);
  });

  it('should get map ids', function() {
    var mapId = 2;
    var item = api.map.findBy('map_id', mapId);
    var ids = item.ids;
    var serialIds = [6,7,8,9,10,11];
    //console.log(item);
    //console.log(ids);
    ids.should.eql(serialIds);
  });

  it('should get nature ids', function() {
    var natureId = '10161';
    var item = api.nature.findBy('nature_id', natureId);
    var condition = item.condition;
    var c = [1101, 1102]; // game_master.nature_condition.card_id whith nature_id = 10161
    condition.should.eql(c);
    //should.strictEqual(undefined, item);
  });

  it('should get pet ids', function() {
    var petId = '2504';
    var item = api.pet.findBy('pet_id', petId);
    var s = item.star;
    var t = 5; // game_master.pet_data.pet_id whith pet_id = 2504
    s.should.eql(t);
    //should.strictEqual(undefined, item);
  });
 
  it('should get petSkill id', function() {
    var skillId = '4601';
    var item = api.petSkill.findBy('skill_id', skillId);
    var s = item["2"].debuff;
    console.log(item["2"]);
    var t = 5880; // game_master.pet_skill_effect.debuff with skill_id = 4601
    s.should.eql(t);
    //should.strictEqual(undefined, item);
  });

  it('should get skill id', function() {
    var skillId = '3005';
    var item = api.skill.findBy('skill_id', skillId);
    var s = item["2"].effect;
    console.log(item["2"]);
    var t = 18; // game_master.skill_data.effect with skill_id = 3005
    s.should.eql(t);
    //should.strictEqual(undefined, item);
  });

  it('should get card id', function() {
    var cardId = '1311';
    var item = api.card.findBy('card_id', cardId);
    var s = item.star;
    var t = 3; // game_master.skill_data.effect with skill_id = 3005
    s.should.eql(t);
    //should.strictEqual(undefined, item);

    //console.log(alpha.cardConf(item.star));
  });


});
