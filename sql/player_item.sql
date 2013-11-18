USE game_world_1001;

#DROP TABLE IF EXISTS player_item;
CREATE TABLE player_item (
  id          int(20) unsigned NOT NULL, # serial number
  player_id   int(10) unsigned NOT NULL, # player_id in player_data
  item_id     int(10) unsigned NOT NULL, # equip_id in equip_data
  num         int(10) unsigned NOT NULL,
  created_on  int(10) unsigned NOT NULL,
  updated_on  int(10) unsigned NOT NULL,
  PRIMARY KEY on_player_id (player_id, item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
