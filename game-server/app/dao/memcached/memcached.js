var Memcached = require('memcached');

// Confirm options and configuration from,
// https://github.com/3rd-Eden/node-memcached

var memcached = new Memcached('127.0.0.1:11211');

var memcachedClient = module.exports;

/* 
 * Init memcached connection pool
 * @param {Object} app The app for the server.
 */
memcachedClient.init = function(app) {
  return memcached;
};
