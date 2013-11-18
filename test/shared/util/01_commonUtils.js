var commonUtils = require('../../../shared/util/commonUtils');

var worldIds = [1001, 1002, 1003, 'aaa'];

for (var i in worldIds) {
  var w = worldIds[i];
  if (!commonUtils.normalizeWorldId(w)) {
    console.log('worldId:' + w + ' normalize failed!');
    break;
  }

  var dbw = commonUtils.worldDBW(w);
  var dbr = commonUtils.worldDBR(w);
  var dbb = commonUtils.worldDBB(w);
  console.log(w + ' master is' + dbw);
  console.log(w + ' slave is' + dbr);
  console.log(w + ' backup is' + dbb);
}
