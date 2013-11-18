USE game_master;

#DROP TABLE IF EXISTS pet_skill_data;
CREATE TABLE pet_skill_data (
  skill_id    int(10) unsigned NOT NULL,
  department  tinyint(3) unsigned NOT NULL, # 水火风雷
  type        tinyint(3) unsigned NOT NULL,
  sk_trigger  tinyint(3) unsigned NOT NULL, # 1, 主动技能, 2, 被动技能
  target      tinyint(3) unsigned NOT NULL, # numpeople
  star        tinyint(3) unsigned NOT NULL,
  keep        tinyint(3) unsigned NOT NULL,
  price       int(10) unsigned NOT NULL,
  effect_id   int(10) unsigned NOT NULL,
  opened_on   int(10) unsigned NOT NULL,
  PRIMARY KEY (skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
