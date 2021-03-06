// mysql CRUD
/**
 * init database
 */
module.exports = function(app, dbhandle) {
  var Pool = require('./dao-pool');
  var util = require('util');
	this.pool = (new Pool(app, dbhandle)).pool;
  app.set(dbhandle, this.pool);

  this.pool.insert = this.pool.update = this.pool.delete = this.pool.query = function(sql, args, cb){
    app.get(dbhandle).acquire(function(err, client) {
    	if (!!err) {
    		console.error('[sqlqueryErr] '+err.stack);
    		return;
    	}
    	client.query(sql, args, function(err, res) {
    		app.get(dbhandle).release(client);
    		cb(err, res);
    	});
    });
  };
  this.pool.dbhandle = dbhandle;
  this.pool.shutdown = function() {
    this.pool.desctroyAllNow();
  };
  this.pool.getName = function() {
    this.pool.getName();
  }
};
