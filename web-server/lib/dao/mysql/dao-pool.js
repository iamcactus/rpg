var mysqlConf = require('../../../../shared/config/mysql');

var env = process.env.NODE_ENV || 'development';
if(mysqlConf[env]) {
  mysqlConf = mysqlConf[env];
}

/*
 * Create mysql connection pool
 */
module.exports = function(app, dbhandle) {
  var _poolModule = require('generic-pool');
  this.name = dbhandle;
  if (dbhandle in mysqlConf) {
    var mysqlConfig = mysqlConf[dbhandle];
  	this.pool = _poolModule.Pool({
  		name: dbhandle,
  		create: function(callback) {
  			var mysql = require('mysql');
  			var client = mysql.createConnection({
  				host: mysqlConfig.host,
  				user: mysqlConfig.user,
  				password: mysqlConfig.password,
  				database: mysqlConfig.database,
          insecureAuth: true // to avoid HANDSHALE_INSECURE_AUTH ERROR in node-mysql
  			});
  			callback(null, client);
  		},
  		destroy: function(client) {
  			client.end();
  		},
  		max: 10,
  		idleTimeoutMillis : 30000,
  		log : false
  	});
  }
  else {
    this.pool = null;
  }
};
