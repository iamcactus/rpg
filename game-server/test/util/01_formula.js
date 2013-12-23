var should = require('should');
var formula = require('../../app/util/formula');

describe('formular test', function() {
  it('should calculate card addon usin gammar', function() {
    var cardId  = '1402';
    var level   = 70;
    var origForce  = formula.origForce(cardId, level);
    // game_master.card_data.card_id whith card_id = 1325

    origForce.atk_o.should.eql(2171); // 2157
    origForce.def_o.should.eql(521);  // 516
    origForce.hp_o.should.eql(3125);  // 3038
    origForce.agi_o.should.eql(292);  // 300
  });

  it('should calculate card addon usin gammar', function() {
    var cardId  = '1325';
    var level   = 78;
    var origForce  = formula.origForce(cardId, level);
    // game_master.card_data.card_id whith card_id = 1325

    origForce.atk_o.should.eql(1786); // 1793
    origForce.def_o.should.eql(436);  // 430
    origForce.hp_o.should.eql(2533);  // 2523
    origForce.agi_o.should.eql(249);  // 249
  });

  it('should calculate card addon using alpha', function() {
    var cardId  = 1402;
    var cnt     = 5;
    var evolveAddon = formula.evolveAddon(cardId, cnt);

    evolveAddon.atk_o.should.eql(425);
    evolveAddon.def_o.should.eql(105);
    evolveAddon.hp_o.should.eql(955);
    evolveAddon.agi_o.should.eql(70);
  });

  it('should calculate equip origin force using delta', function() {
    var equips = [5101,5104,5201];
    var addons = [139, 37, 204];
    for (var i in equips) {
      var equipId = equips[i];
      var level = 11;
      var equipOrigForce =  formula.equipOrigForce(equipId, level);
      equipOrigForce.should.eql(addons[i]);
    }
  });

  it('should calculate equip addon using delta', function() {
    var equips = [5201];
    var cards = [1402];
    var addons = [67];
    for (var i in equips) {
      var equipAddon = formula.equipAddon(equips[i], cards[i]);
      equipAddon.should.eql(addons[i]);
    }
  });

  it('should calculate nature addon', function() {
    var cardId  = '1402';
    var level   = 76;
    var cards   = [1402, 1522];
    var equips  = [];
    var natureAddon  = formula.natureAddon(cards, equips, cardId, level);

    natureAddon.atk_o.should.eql(0);
    natureAddon.def_o.should.eql(0);
    natureAddon.hp_o.should.eql(0);
    natureAddon.agi_o.should.eql(126);  // 130
  });

});
