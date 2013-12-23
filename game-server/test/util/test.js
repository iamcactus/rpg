var should = require('should');
var api = require('../../../game-server/app/util/dataApi');

var name = 'test';

describe('JSON data api test', function() {
  var mission = api.mission;
  var NGWord = api.NGWord;
  //console.log(mission);
  it('can findBy a attribute', function(){
    var item = mission.findBy("id", "28");
    //console.log(item);
  });
/*
  var role = api.role;
  it('can findBy a attribute', function(){
    var item = role.findBy("career", "剑客");
  console.log(item);
    //item.should.be.an.instanceof(Array);
    item[0].career.should.equal("剑客");
    var r = item[2];
    r.should.have.property('id', 1020);
    //r.should.have.property('hp', 54);
    //r.should.have.property('mp', 48);
    r.name.should.equal("龙太子");
  });
*/

  it('can list all item of NGWord', function() {
     var list = NGWord.all();
     //list.should.be.an.instanceof(Array);
     // list.length.should.equal(12);

     list[0].should.equal('18禁');
  });
});
