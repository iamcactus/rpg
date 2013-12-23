USE game_world_1001;

DROP TABLE IF EXISTS unit_meridian;
CREATE TABLE unit_meridian (
  player_card_id     int(10) unsigned NOT NULL, # id in player_card
  position_id tinyint(3) unsigned NOT NULL, #
  stone_id    int(10) unsigned DEFAULT NULL, # id in property conf
  created_on  int(10) unsigned NOT NULL,
  updated_on  int(10) unsigned NOT NULL,
  UNIQUE KEY on_player_card_id_and_position_id (player_card_id, position_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

