var crypto = require('crypto');

var pass = '12345678ADSF';
var md5 = crypto.createHash('md5');
md5.update(pass);
var res = md5.digest('hex');
console.log('result =====', res);
