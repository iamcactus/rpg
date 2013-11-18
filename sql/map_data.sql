USE game_master;

#DROP TABLE IF EXISTS map_data;
CREATE TABLE map_data (
  map_id      int(10) unsigned NOT NULL,
  opened_on   int(10) unsigned NOT NULL,
  PRIMARY KEY (map_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
