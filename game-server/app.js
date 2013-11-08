var pomelo = require('pomelo');
var routeUtil = require('./app/util/routeUtil');
/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'chatofpomelo-websocket');

// app configuration
app.configure('production|development', 'connector', function(){
	app.set('connectorConfig',
		{
			connector : pomelo.connectors.hybridconnector,
			heartbeat : 3,
			useDict : true,
			useProtobuf : true
		});
});

app.configure('production|development', 'gate', function(){
	app.set('connectorConfig',
		{
			connector : pomelo.connectors.hybridconnector,
			useProtobuf : true
		});
});

// Configure for auth server
app.configure('production|development', 'auth', function() {
	// load session congfigures
	app.set('session', require('./config/session.json'));
});


// app configure
app.configure('production|development', function() {
	// route configures
	app.route('chat', routeUtil.chat);

  app.loadConfig('mysql', app.getBase() + '/../shared/config/mysql.json');

	// filter configures
	app.filter(pomelo.timeout());
});

// database configure
app.configure('production|development', 'auth|chat|connector', function() {
  var mysqlConf = (app.get('mysql'));
  for (var dbhandle in mysqlConf) {
    var dbclient = require('./app/dao/mysql/mysql')
    dbclient.init(app, dbhandle);
    app.set(dbhandle, dbclient);
  }
  //app.use(sync, {sync: {path:__dirname + 'app/dao/mapping', dbclient: dbclient}});
});

// memcached configure
app.configure('production|development', 'auth|chat|connector', function() {
  var memcached = require('./app/dao/memcached/memcached').init(app);
  app.set('memcached', memcached);
  //app.use(sync, {sync: {path:__dirname + 'app/dao/mapping', dbclient: dbclient}});
});

// start app
app.start();

process.on('uncaughtException', function(err) {
	console.error(' Caught exception: ' + err.stack);
});
