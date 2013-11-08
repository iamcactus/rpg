var _poolModule = require('generic-pool');
var mysqlConf = require('../../../../shared/config/mysql');

var env = process.env.NODE_ENV || 'development';
if(mysqlConf[env]) {
  mysqlConf = mysqlConf[env];
}

/*
 * Create mysql connection pool
 */
var createMysqlPool = function(app, dbhandle) {
  if (dbhandle in mysqlConf) {
    var mysqlConfig = mysqlConf[dbhandle];
  	return _poolModule.Pool({
  		name: 'mysql',
  		create: function(callback) {
  			var mysql = require('mysql');
  			var client = mysql.createConnection({
  				host: mysqlConfig.host,
  				user: mysqlConfig.user,
  				password: mysqlConfig.password,
  				database: mysqlConfig.database
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
    return null;
  }
};

exports.createMysqlPool = createMysqlPool;