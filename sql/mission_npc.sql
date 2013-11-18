USE game_master;

#DROP TABLE IF EXISTS mission_npc;
CREATE TABLE mission_npc (
  mission_id    int(10) unsigned NOT NULL,
  npc_id    int(10) unsigned NOT NULL,
  PRIMARY KEY (mission_id, npc_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
