USE game_world_1001;

DROP TABLE IF EXISTS player_fraction;
CREATE TABLE player_fraction (
  player_id   int(10) unsigned NOT NULL, # player_id in player_data
  type        tinyint(3) unsigned NOT NULL, # 英雄or装备or宠物
  star        tinyint(3) unsigned NOT NULL, # 1-4
  num         int(10) unsigned NOT NULL,
  created_on  int(10) unsigned NOT NULL,
  updated_on  int(10) unsigned NOT NULL,
  UNIQUE KEY on_player_id_and_type_and_star (player_id, type, star)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
