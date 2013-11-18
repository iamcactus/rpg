USE game_world_1001;

#DROP TABLE IF EXISTS player_unit;
CREATE TABLE player_unit (
  player_id  int(10) unsigned NOT NULL, # player_id in player_data
  position_id     tinyint(3) unsigned NOT NULL, # 队伍位置 1-8
  player_card_id  int(10) unsigned NOT NULL, # id in player_card
  weapon_id   int(10) unsigned DEFAULT NULL, # equip_id in player_equip
  defender_id int(10) unsigned DEFAULT NULL, # equip_id in player_equip
  shoe_id     int(10) unsigned DEFAULT NULL, # equip_id in player_equip
  jewelry_id  int(10) unsigned DEFAULT NULL, # equip_id in player_equip
  created_on  int(10) unsigned NOT NULL,
  updated_on  int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (player_id, position_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
