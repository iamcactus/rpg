// evolution has an addon on card's original force
// see formula.evolveAddon

var alpha = {
  "1": "comment: evolved star one",
  "1":  {
    INITIAL_LV:15,
    LVADD:0,
    ATK:0,
    DEF:0,
    HP:0,
    AGI:0,
    PULE_MAC:1,
    PULSEADD:0,
    MAX_STAGE:0
  },
  "2": "comment: evolved star two",
  "2":  {
    INITIAL_LV:20,
    LVADD:0,
    ATK:0,
    DEF:0,
    HP:0,
    AGI:0,
    PULE_MAC:1,
    PULSEADD:0,
    MAX_STAGE:0
  },
  "3": "comment: evolved star three",
  "3":  {
    INITIAL_LV:25,
    LVADD:6,
    ATK:44,
    DEF:11,
    HP:99,
    AGI:7,
    PULE_MAC:2,
    PULSEADD:3,
    MAX_STAGE:13
  },
  "4": "comment: evolved star four",
  "4":  {
    INITIAL_LV:30,
    LVADD:8,
    ATK:85,
    DEF:21,
    HP:191,
    AGI:14,
    PULE_MAC:3,
    PULSEADD:2,
    MAX_STAGE:9
  },
  "5": "comment: evolved star five",
  "5":  {
    INITIAL_LV:35,
    LVADD:10,
    ATK:136,
    DEF:34,
    HP:307,
    AGI:23,
    PULE_MAC:5,
    PULSEADD:1,
    MAX_STAGE:7
  }
};

module.exports.getAlpha = function(star) {
  return alpha[star];
};
