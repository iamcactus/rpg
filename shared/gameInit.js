module.exports = {
  PLAYER_INIT: {
    MAX_POWER:  30,   // 体力
    MAX_ENERGY: 10,   // 精力
    GOLD:       30,   // 元宝
    SILVER:     5100, // 银两
  },
  STONE_INIT: {
    ID: 8000, // 无属性石头，代表该穴位开放 
  },
  BATTLE_INIT: {
    RESTRAINT_PARAM:  1.4, // restraint effect is 40%
    DAMAGE:       -1, // default damage
    MAX_TURN:     3,
    MAX_ROUND:    10,
    MAX_STEP:     8,
    ROUND_IN_TURN:5,  // 5 rounds in 1 turn
    TEAM_PEOPLE:  4,
    SKILL_CNT:    25
  },
  BAG: {
    CARD: {
      "type": "general",
      "id":   101
    },
    EQUIP: {
      "type": "equip",
      "id":   102
    },
    PET:  {
      "type": "pet",
      "id":   103
    },
    SKILL: {
      "type": "skill",
      "id":   104
    },
    ITEM: {
      "type": "prop",
      "id":   105
    },
  },
  COMPO: {
    CARD_NUM: 3,
    PET_NUM:  3,
    EQUIP_NUM:6
  },
  DECOMPO: {
    CARD_NUM: 3,
    PET_NUM:  3,
    EQUIP_NUM:6
  },
  TRANSMISSION: {
    NORMAL: {
      "type":     "normal", // used by commonUtils.getInitID
      "id":       201,
      ITEMID:   16001,
      DISCOUNT: 0.6,
      EXP:      5033
    },
    SUPER: {
      "type":     "super", // used by commonUtils.getInitID
      "id":       202,
      ITEMID:   16002,
      DISCOUNT: 0.8,
      EXP:      80525
    }
  },
  STRENGTHEN: {
    EQUIP: {
      MAXLV: 200
    }
  },
  VIP: {
    MAXLV: 10
  },
  UNIT_INIT: {
    COUNT:  "comment: level up condition for next position open",
    COUNT:  3,
    CONF:   "position: level",
    CONF: {
      1:  1,
      2:  4,
      3:  7,
      4:  10,
      5:  13,
      6:  16,
      7:  19,
      9:  22
    }
  },
  EQUIP_CONF: {
    1: {
      TYPE: 'jewelry',
      EFFECT: 'hp',
      POSITION: 6
    },
    2: {
      TYPE: 'weapon',
      EFFECT: 'atk',
      POSITION: 3
    },
    3: {
      TYPE: 'defender',
      EFFECT: 'def',
      POSITION: 4
    },
    4: {
      TYPE: 'shoe',
      EFFECT: 'agi',
      POSITION: 5
    }
  },
  LEAD_CONF: {
    1:  3,
    2:  5,
    3:  10,
    4:  18,
    5:  28
  }
};
