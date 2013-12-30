// beta is the basic parameter for card level up
// there are five star levels as beginning
var beta = {
  "1": "comment: star level one",
  "1":  {
    "atk":  11.50,
    "def":  2.75,
    "hp":   16.25,
    "agi":  1.50
  },
  "2": "comment: star level two",
  "2":  {
    "atk":  16.50,
    "def":  4.00,
    "hp":   23.25,
    "agi":  2.25
  },
  "3": "comment: star level three",
  "3":  {
    "atk":  21.50,
    "def":  5.25,
    "hp":   30.50,
    "agi":  3.00
  },
  "4": "comment: star level four",
  "4":  {
    "atk":  23.20,
    "def":  5.80,
    "hp":   52.20,
    "agi":  3.87
  },
  "5": "comment: star level five",
  "5":  {
    "atk":  24.48,
    "def":  6.84,
    "hp":   84.24,
    "agi":  4.80
  }
};

// gammar is the addon parameter for card level up
var gammar = {
  "1": "comment: star level one",
  "1":  {
    "1":  "comment: card attribute--type one", 
    "1":  {
      "atk":  0.71,
      "def":  0.83,
      "hp":   1.73,
      "agi":  1.00
    },
    "2":  "comment: card attribute--type two", 
    "2":  {
      "atk":  1.00,
      "def":  1.00,
      "hp":   1.00,
      "agi":  1.00
    },
    "3":  "comment: card attribute--type three", 
    "3":  {
      "atk":  0.83,
      "def":  0.89,
      "hp":   1.33,
      "agi":  1.00
    }
  },
  "2": "comment: star level two",
  "2":  {
    "1":  "comment: card attribute--type one", 
    "1":  {
      "atk":  0.84,
      "def":  0.86,
      "hp":   1.33,
      "agi":  1.00
    },
    "2":  "comment: card attribute--type two", 
    "2":  {
      "atk":  1.00,
      "def":  1.00,
      "hp":   1.00,
      "agi":  1.00
    },
    "3":  "comment: card attribute--type three", 
    "3":  {
      "atk":  0.75,
      "def":  0.80,
      "hp":   1.75,
      "agi":  1.00
    }
  },
  "3": "comment: star level three",
  "3":  {
    "1":  "comment: card attribute--type one", 
    "1":  {
      "atk":  0.70,
      "def":  0.80,
      "hp":   1.72,
      "agi":  1.00
    },
    "2":  "comment: card attribute--type two", 
    "2":  {
      "atk":  1.00,
      "def":  1.00,
      "hp":   1.00,
      "agi":  1.00
    },
    "3":  "comment: card attribute--type three", 
    "3":  {
      "atk":  0.85,
      "def":  0.95,
      "hp":   0.80,
      "agi":  1.00
    }
  },
  "4": "comment: star level four",
  "4":  {
    "1":  "comment: card attribute--type one", 
    "1":  {
      "atk":  0.88,
      "def":  1.00,
      "hp":   1.34,
      "agi":  1.00
    },
    "2":  "comment: card attribute--type two", 
    "2":  {
      "atk":  1.25,
      "def":  1.20,
      "hp":   0.80,
      "agi":  1.00
    },
    "3":  "comment: card attribute--type three", 
    "3":  {
      "atk":  1.00,
      "def":  1.00,
      "hp":   1.00,
      "agi":  1.00
    }
  },
  "5": "comment: star level five",
  "5":  {
    "1":  "comment: card attribute--type one", 
    "1":  {
      "atk":  1.00,
      "def":  1.00,
      "hp":   1.00,
      "agi":  1.00
    },
    "2":  "comment: card attribute--type two", 
    "2":  {
      "atk":  1.47,
      "def":  1.26,
      "hp":   0.60,
      "agi":  1.00
    },
    "3":  "comment: card attribute--type three", 
    "3":  {
      "atk":  1.23,
      "def":  1.10,
      "hp":   0.80,
      "agi":  1.00
    }
  }
};

// role restraint
var restraint = {
  "1":  "comment: role 1 is RenJie",
  "1":  3,
  "2":  "comment: role 2 is GuiXiong",
  "2":  1,
  "3":  "comment: role 3 is YingHao",
  "3":  2,
};

module.exports.roleRestraint = function(role) {
  return restraint[role];
};

module.exports.cardBeta = function(star) {
  return beta[star];
};

module.exports.cardGammar = function(star, type) {
  return gammar[star][type];
};
