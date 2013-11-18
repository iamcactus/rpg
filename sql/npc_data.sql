USE game_master;

#DROP TABLE IF EXISTS npc_data;
CREATE TABLE npc_data (
  npc_id    int(10) unsigned NOT NULL,
  gid       int(10) unsigned NOT NULL,
  logo_id   int(10) unsigned NOT NULL,
  PRIMARY KEY (npc_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
