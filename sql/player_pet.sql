USE game_world_1001;

DROP TABLE IF EXISTS player_pet;
CREATE TABLE player_pet (
  id          int(20) unsigned NOT NULL, # serial number
  player_id   int(10) unsigned NOT NULL, # player_id in player_data
  pet_id      int(10) unsigned NOT NULL, # pet_id in pet_data
  is_onarm    tinyint(3) unsigned NOT NULL DEFAULT 0, # 装备中与否
  created_on  int(10) unsigned NOT NULL,
  updated_on  int(10) unsigned NOT NULL,
  PRIMARY KEY (id),
  KEY on_player_id_and_is_onarm (player_id, is_onarm)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
