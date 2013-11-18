USE game_master;

#DROP TABLE IF EXISTS nature_condition;
CREATE TABLE nature_condition (
  nature_id   int(10) unsigned NOT NULL,
  card_id     int(10) unsigned NOT NULL,
  opened_on   int(10) unsigned NOT NULL,
  PRIMARY KEY (card_id, nature_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
