USE game_world_1001;

#DROP TABLE IF EXISTS player_pet;
CREATE TABLE player_pet (
  id          int(20) unsigned NOT NULL, # serial number
  player_id   int(10) unsigned NOT NULL, # player_id in player_data
  pet_id      int(10) unsigned NOT NULL, # pet_id in pet_data
  created_on  int(10) unsigned NOT NULL,
  updated_on  int(10) unsigned NOT NULL,
  PRIMARY KEY (id),
  KEY on_player_id (player_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
