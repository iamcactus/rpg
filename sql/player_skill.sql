USE game_world_1001;

#DROP TABLE IF EXISTS player_skill;
CREATE TABLE player_skill (
  id          int(20) unsigned NOT NULL, #serial number
  player_id   int(10) unsigned NOT NULL, # id in player_data
  skill_id    int(10) unsigned NOT NULL, # id in skill_data
  exp         int(10) unsigned NOT NULL,
  level       tinyint(10) unsigned NOT NULL,
  is_onarm    tinyint(3) unsigned NOT NULL DEFAULT 0, # 装备中与否
  created_on  int(10) unsigned NOT NULL,
  updated_on  int(10) unsigned NOT NULL,
  PRIMARY KEY (id),
  KEY on_player_id_and_is_onarm (player_id, is_onarm)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
