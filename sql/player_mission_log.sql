USE game_world_1001;

Drop TABLE IF EXISTS player_mission_log;
CREATE TABLE player_mission_log (
  player_id   int(10) unsigned NOT NULL,
  mission_data_id  int(10) unsigned NOT NULL, # id in mission_data
  clear_num   int(10) unsigned NOT NULL DEFAULT 0,
  rate        tinyint(3) unsigned NOT NULL DEFAULT 0,
  created_on  int(10) unsigned NOT NULL,
  updated_on  int(10) unsigned NOT NULL,
  PRIMARY KEY (player_id, mission_data_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
