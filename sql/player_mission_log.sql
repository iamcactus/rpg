USE game_world_1001;
#Drop table if exists player_mission_log;
CREATE TABLE player_mission_log (
  player_id   int(10) unsigned NOT NULL,
  mission_id  int(10) unsigned NOT NULL,
  rate        tinyint(3) unsigned NOT NULL, # 完成度
  clear_num   int(10) unsigned NOT NULL,
  created_on  int(10) unsigned NOT NULL,
  updated_on  int(10) unsigned NOT NULL,
  PRIMARY KEY (player_id, mission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
