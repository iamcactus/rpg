var fs = require('fs');
var mysql = require('mysql');
var async = require('async');
var util = require('util');
var connection = mysql.createConnection(
  {
    host      : '127.0.0.1',
    user      : 'onemore',
    password  : 'onemore01',
    database  : 'game_master',
    insecureAuth: true
  }
);
var output = 'mission.json';

connection.connect();

var selectMDSQL = 'select * from mission_data'; 
var selectMASQL = 'select * from mission_award';
var selectMNSQL = 'select * from mission_npc';

var md;
var ma = {};
var mn = {};

async.auto({
  md: function (callback) {
    connection.query(selectMDSQL, function (err, res1) {
      callback(err, res1);
    });
  },
  ma: function (callback) {
    connection.query(selectMASQL, function (err, res2) {
      callback(err, res2);
    });
  },
  mn: function (callback) {
    connection.query(selectMNSQL, function (err, res3) {
      callback(err, res3);
    });
  }
}, function (err, res) {
  if (err) throw err;
  //console.log(res);

  md = res.md;
  ma = res.ma;
  mn = res.mn;
  //console.log(ma);
  var k1 = 0, v1 = 0;
  var k2 = 0, v2 = 0, v3 = 0;
  for (var i in ma) {
      k1 = ma[i]['mission_data_id'];
      v1 = ma[i]['award_id'];
      k1--; // why? forgot T_T
      //console.log(md[k]);
      if (typeof md[k1]['award_id'] == 'undefined') {
        md[k1]['award_id'] = [];
      }
      md[k1]['award_id'].push(v1);
      //console.log(md[k1]);
  }
  for (var j in mn) {
      k2 = mn[j]['mission_data_id'];
      v2 = mn[j]['npc_id'];
      v3 = mn[j]['position_id'];
      console.log(j);
      console.log(k2);
      console.log(v2);
      console.log(v3);
      k2--;
      //console.log(md[k]);
      if (typeof md[k2]['npc_id'] == 'undefined') {
        md[k2]['npc_id'] = [];
      }
      //md[k2]['npc_id'].push(v2);
      md[k2]['npc_id'][v3 - 1] = v2; // set according to the position, v3 -1 results into the array position
      console.log(md[k2]);
  }
  //console.log(JSON.stringify(md));
  fs.writeFile(output, JSON.stringify(md), function(err) {
    if (err) {
      throw err;
    }
    else {
      console.log('output into ' + output);
      //console.log(md);
    }
  });
});

connection.end();
