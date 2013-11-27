//var t='';
var t = 32100000;

var a = [1, '', 12345678, 0, 0.1, -1, -10, '004a', 'asfa123', 'asdf'];

for (var k in a) {
  console.log('v:');
  console.log(a[k]);
  var res = parseNumber(a[k]);
  console.log('res:');
  console.log(res);
}

function parseNumber(val) {
  return isNaN(parseInt(val)) ? 0 : parseInt(val);
}
