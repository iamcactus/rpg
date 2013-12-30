var should = require('should');
var formula = require('../../app/util/formula');

describe('formular test', function() {
  it('should get damage as:', function() {

    for (var i in damages) {
      var damage = formula.damage(damages[i].atkerObj, damages[i].atkeeObj, damages[i].atkSkillObj);
      damage.should.eql(damages[i].damage);
    }
  });
});

var damages = {
  "1":  "comment: no skill neather no restraint",
  "1":  {
    "skillData":   {
    },
    "atkSkillObj": {
    },
    "atkerObj": {
      "atk" : 1000,
      "def":  800,
      "role": 2
    },
    "atkeeObj": {
      "atk" : 1200,
      "def" : 800,
      "role": 2
    },
    "damage": 200
  },
  "2":  "comment: no skill but with restraint",
  "2":  {
    "skillData":   {
    },
    "atkSkillObj": {
    },
    "atkerObj": {
      "atk" : 1000,
      "def":  800,
      "role": 2
    },
    "atkeeObj": {
      "atk" : 1200,
      "def" : 800,
      "role": 1
    },
    "damage": 280
  },
  "3":  "comment: with skill and with restraint",
  "3":  {
    "skillData":   {
      "skill_id": 3009,
      "level":    10,
      "sucess":   14,
      "effect":   35,
      "target":   2
    },
    "atkSkillObj": {
      "skill_id": 3009,
      "skill_lv": 10
    },
    "atkerObj": {
      "atk" : 1000,
      "def":  800,
      "role": 2
    },
    "atkeeObj": {
      "atk" : 1200,
      "def" : 800,
      "role": 1
    },
    "damage":98
  },
  "4":  "comment: with skill but no restraintt",
  "4":  {
    "skillData":   {
      "skill_id": 3009,
      "level":    10,
      "sucess":   14,
      "effect":   35,
      "target":   2
    },
    "atkSkillObj": {
      "skill_id": 3009,
      "skill_lv": 10
    },
    "atkerObj": {
      "atk" : 1000,
      "def":  800,
      "role": 2
    },
    "atkeeObj": {
      "atk" : 1200,
      "def" : 800,
      "role": 2
    },
    "damage": 70
  }
};
