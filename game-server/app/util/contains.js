var beta = {
  "one":  {
    "atk":   11.50,
    "def":  2.75,
    "hp":   16.25,
    "agi":  1.50
  },
  "two":  {
    "atk":   16.50,
    "def":  4.00,
    "hp":   23.25,
    "agi":  2.25
  },
  "three":  {
    "atk":   21.50,
    "def":  5.25,
    "hp":   30.50,
    "agi":  3.00
  },
  "four":  {
    "atk":   23.20,
    "def":  5.80,
    "hp":   52.20,
    "agi":  3.87
  },
  "five":  {
    "atk":   24.48,
    "def":  6.84,
    "hp":   84.24,
    "agi":  4.80
  }
};
 
var getBeta = function(star) {
  switch(star) {
    case 1:
      return beta.one;
      break;
    case 2:
      return beta.two;
      break;
    case 3:
      return beta.three;
      break;
    case 4:
      return beta.four;
      break;
    case 5:
      return beta.five;
      break;
  }
}

var hero01 = {
  "hp_c":   243,
  "atk_c":  170,
  "def_c":  40,
  "agi_c":  24,
  "star":   4,
  "type":   2,
  "role":   2,
};

var hero02 = {
  "hp_c":   310,
  "atk_c":  92,
  "def_c":  26,
  "agi_c":  18,
  "star":   3,
  "type":   1,
  "role":   3,
};

var level = 71;

// hero: object
var forceFormula = function(hero, lv) {
  console.log(hero);
  var beta = getBeta(hero.star);
  console.log(beta);
  var hp = Math.ceil(hero.hp_c + lv * beta.hp);
  var atk = Math.ceil(hero.atk_c + lv * beta.atk);
  var def = Math.ceil(hero.def_c + lv * beta.def);
  var agi = Math.ceil(hero.agi_c + lv * beta.agi);
  console.log(hp);
  console.log(atk);
  console.log(def);
  console.log(agi);

  return {
    "hp_c":   hp,
    "atk_c":  atk,
    "def_c":  def,
    "agi_c":  agi,
    "star":   hero.star,
    "type":   hero.type,
    "role":   hero.role,
  };
}
console.log(forceFormula(hero01, level));
console.log(forceFormula(hero02, level));
