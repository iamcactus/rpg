USE game_master;

DROP TABLE IF EXISTS mission_npc;
CREATE TABLE mission_npc (
  mission_data_id int(10) unsigned NOT NULL, # id in mission_data
  npc_id          int(10) unsigned NOT NULL,
  position_id     tinyint(3)  unsigned NOT NULL,
  PRIMARY KEY (mission_data_id, npc_id, position_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
