var exp = module.exports;

exp.getName = function (deviceInfo) {
  var name = Math.round(new Date().getTime()/1000);
  return "u" + name;
};

exp.getPasswordHash = function (deviceInfo) {
  var i=0;
  var ps = '';

  while (i<6) {
    var r = parseInt(Math.random()*10);
    r = r > 0 ? r : 1;
    ps += r;
    i++;
  }
  console.log('ps:' + ps);
  return ps ? ps : 478569;
};
