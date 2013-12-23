USE game_world_1001;

DROP TABLE IF EXISTS player_unit;
CREATE TABLE player_unit (
  player_id  int(10) unsigned NOT NULL, # player_id in player_data
  position_id     tinyint(3) unsigned NOT NULL, # 队伍位置 1-8
  player_card_id  int(10) unsigned NOT NULL, # id in player_card
  weapon_id   int(10) unsigned DEFAULT NULL, # equip_id in player_equip
  defender_id int(10) unsigned DEFAULT NULL, # equip_id in player_equip
  shoe_id     int(10) unsigned DEFAULT NULL, # equip_id in player_equip
  jewelry_id  int(10) unsigned DEFAULT NULL, # equip_id in player_equip
  stdskill1_id  int(10) unsigned DEFAULT NULL, # id in skill_effect
  stdskill2_id  int(10) unsigned DEFAULT NULL, # id in skill_effect
  created_on  int(10) unsigned NOT NULL,
  updated_on  int(10) unsigned DEFAULT NULL,
  PRIMARY KEY on_player_id_and_position_id (player_id, position_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
