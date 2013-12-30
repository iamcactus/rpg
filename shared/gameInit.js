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
  }
};
