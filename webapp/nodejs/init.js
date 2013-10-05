#!/usr/bin/env node

var fs = require('fs');
var async   = require('async');
var memcache = require('memcache');
var client = new memcache.Client(11212, 'localhost');
client.connect();

function cache(prefix, path, callback) {
  var ar = fs.readdirSync(path);
  async.map(ar, function(fname, callback) {
    var content = fs.readFileSync(path + fname, {encoding: 'utf8'});
    client.set(prefix + fname, content, function() {
      console.log(prefix + fname);
      callback(null, null);
    }, 0);
  }, function(err, results) {
    callback();
  });
}
cache('css:/css/', "/home/isucon/webapp/nodejs/public/css/", function() {
  cache('js:/js/', "/home/isucon/webapp/nodejs/public/js/", function() {
    console.log('loaded');
    client.close();
    process.exit();
  });
});

