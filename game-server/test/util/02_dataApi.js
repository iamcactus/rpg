var should = require('should');
var api = require('../../app/util/dataApi');

describe('JSON data api test', function() {
  var map = api.map;

  it('should get card ids', function() {
    var cardId = '1235';
    var item = api.card.findBy('card_id', cardId);
    var s = item.hp_c;
    var t = 316; // game_master.card_data.card_id whith card_id = 1235
    s.should.eql(t);
  });
});
