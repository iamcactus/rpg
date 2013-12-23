USE game_master;

DROP TABLE IF EXISTS pet_skill_effect;
CREATE TABLE pet_skill_effect (
  id          int(10) unsigned NOT NULL, # serial number
  skill_id    int(10) unsigned NOT NULL, # skill_id in skill_data
  level       tinyint(3) unsigned NOT NULL, # 技能等级
  success     smallint(5) unsigned NOT NULL, # 附属效果发生几率 x 100
  max_sp      smallint(5) unsigned NOT NULL, # 幻兽攻击力的伤害比例 x 100
  debuff      smallint(5) unsigned NOT NULL, # 附属效果的效果比例 x 100
  opened_on   int(10) unsigned NOT NULL,
  PRIMARY KEY (id),
  KEY on_skill_id_and_level (skill_id, level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
