USE game_master;
#Drop table if exists nature_condition;
CREATE TABLE nature_condition (
  nature_id   int(10) unsigned NOT NULL,
  card_id     int(10) unsigned NOT NULL,
  opened_on   int(10) unsigned NOT NULL,
  PRIMARY KEY (nature_id, card_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
