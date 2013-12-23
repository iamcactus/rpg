USE game_world_1001;

DROP TABLE IF EXISTS player_item;
CREATE TABLE player_item (
  player_id   int(10) unsigned NOT NULL, # player_id in player_data
  item_id     int(10) unsigned NOT NULL, # equip_id in equip_data
  num         int(10) unsigned NOT NULL,
  PRIMARY KEY on_player_id_and_item_id (player_id, item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
