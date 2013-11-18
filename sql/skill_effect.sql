USE game_master;

#DROP TABLE IF EXISTS skill_effect;
CREATE TABLE skill_effect (
  id          int(10) unsigned NOT NULL, # serial number
  skill_id    int(10) unsigned NOT NULL, # skill_id in skill_data
  level       tinyint(3) unsigned NOT NULL, # 技能等级
  success     tinyint(3) unsigned NOT NULL, # 发动几率
  effect      tinyint(3) unsigned NOT NULL, # 发动效果百分比
  property    tinyint(3) unsigned NOT NULL, # 技能属性例如攻防
  scale       tinyint(3) unsigned NOT NULL, # 发动效果例如微弱普通巨大
  opened_on   int(10) unsigned NOT NULL,
  PRIMARY KEY (id),
  KEY on_skill_id_and_level (skill_id, level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
