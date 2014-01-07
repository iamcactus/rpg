var should = require('should');
var drawPrize = require('../../app/util/drawPrize');

describe('drawPrize test', function() {
  it('should get cards randomly', function() {
    var type  = 1; // type in card_data
    var star  = 2; // star in card_data
    var num   = 1; // how many prizes
    var cardArray = drawPrize.hero(type, star, num);
    //console.log(cardArray);
  });
});

describe('drawPrize test', function() {
  it('should get equips randomly', function() {
    var type  = 2; // type in card_data
    var star  = 2; // star in card_data
    var num   = 1; // how many prizes
    var equipArray = drawPrize.equip(type, star, num);
    console.log(equipArray);
  });
});

describe('drawPrize test', function() {
  it('should get pets randomly', function() {
    var type  = 1; // type in card_data
    var star  = 2; // star in card_data
    var num   = 1; // how many prizes
    var petArray = drawPrize.pet(type, star, num);
    //console.log(petArray);
  });
});
