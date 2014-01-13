USE game_world_1001;

DROP TABLE IF EXISTS player_pet;
CREATE TABLE player_pet (
  id          int(20) unsigned NOT NULL, # serial number
  player_id   int(10) unsigned NOT NULL, # player_id in player_data
  pet_id      int(10) unsigned NOT NULL, # pet_id in pet_data
  exp         int(10) unsigned NOT NULL DEFAULT 0,
  level       int(10) unsigned NOT NULL DEFAULT 1,
  evolved_cnt tinyint(3) unsigned NOT NULL DEFAULT 0, # 进化次数
  max_level   int(10) unsigned NOT NULL DEFAULT 0,
  posi_skill1_id int(10) unsigned DEFAULT NULL, # 主动技能1, id in pet_skill_effect
  posi_skill2_id int(10) unsigned DEFAULT NULL, # 主动技能2
  posi_skill3_id int(10) unsigned DEFAULT NULL, # 主动技能3
  nega_skill1_id int(10) unsigned DEFAULT NULL, # 被动技能1
  nega_skill2_id int(10) unsigned DEFAULT NULL, # 被动技能2
  nega_skill3_id int(10) unsigned DEFAULT NULL, # 被动技能3
  is_onarm    tinyint(3) unsigned NOT NULL DEFAULT 0, # 装备中与否
  created_on  int(10) unsigned NOT NULL,
  updated_on  int(10) unsigned NOT NULL,
  PRIMARY KEY (id),
  KEY on_player_id_and_is_onarm (player_id, is_onarm)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
