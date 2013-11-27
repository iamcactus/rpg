var should = require('should');
var api = require('../../app/util/dataApi');

describe('JSON data api test', function() {
  var map = api.map;

  it('shoule get ids', function() {
    var mapId = 1;
    var item = api.map.findById(mapId);
    var ids = item.ids;
    console.log(ids);
    var ids = item.ids.split(',');
    var a = [1,2,3,4,5];
    ids.should.equal(a);
  });

  it('', function() {
    var mapId = '';
    var item = api.map.findById(mapId);
    should.strictEqual(undefined, item);
  });

});
