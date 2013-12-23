// equip stronthen conf
// see formula.equipAddon
var delta = {
  "1": "comment: star level one",
  "1":  {
    "1": "comment: jewelry",
    "1":  19.76,
    "2": "comment: weapon",
    "2":  8.78,
    "3": "comment: defender",
    "3":  2.23,
    "4": "comment: shoe",
    "4":  1.44
  },
  "2": "comment: star level two",
  "2":  {
    "1":  28.41,
    "2":  12.63,
    "3":  3.21,
    "4":  2.07
  },
  "3": "comment: star level three",
  "3":  {
    "1":  37.06,
    "2":  16.47,
    "3":  4.19,
    "4":  2.7
  },
  "4": "comment: star level four",
  "4":  {
    "1":  49.41,
    "2":  21.96,
    "3":  5.58,
    "4":  3.6
  },
  "5": "comment: star level five",
  "5":  {
    "1":  61.67,
    "2":  27.45,
    "3":  6.97,
    "4":  4.5
  }
};

module.exports.equipDelta = function(star) {
  return delta[star];
};
