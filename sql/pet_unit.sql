USE game_world_1001;

#DROP TABLE IF EXISTS pet_unit;
CREATE TABLE pet_unit (
  player_pet_id int(20) unsigned NOT NULL, # id in player_pet
  level       int(10) unsigned NOT NULL,
  evolved_cnt tinyint(3) unsigned NOT NULL DEFAULT 0, # 进化次数
  max_level   int(10) unsigned NOT NULL,
  posi_skill1_id int(10) unsigned DEFAULT NULL, # 主动技能1, id in pet_skill_effect
  posi_skill2_id int(10) unsigned DEFAULT NULL, # 主动技能2
  posi_skill3_id int(10) unsigned DEFAULT NULL, # 主动技能3
  nega_skill1_id int(10) unsigned DEFAULT NULL, # 被动技能1
  nega_skill2_id int(10) unsigned DEFAULT NULL, # 被动技能2
  nega_skill3_id int(10) unsigned DEFAULT NULL, # 被动技能3
  is_teamed   tinyint(10) unsigned NOT NULL DEFAULT 0, # 上阵中与否
  created_on  int(10) unsigned NOT NULL,
  updated_on  int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (player_pet_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
