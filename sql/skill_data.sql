USE game_master;

#DROP TABLE IF EXISTS skill_data;
CREATE TABLE skill_data (
  skill_id    int(10) unsigned NOT NULL,
  type        tinyint(3) unsigned NOT NULL,
  target      tinyint(3) unsigned NOT NULL,
  star        tinyint(3) unsigned NOT NULL,
  hide        tinyint(3) unsigned NOT NULL,
  needid      int(10) unsigned NOT NULL,
  price       int(10) unsigned NOT NULL,
  effect_id   int(10) unsigned NOT NULL,
  opened_on   int(10) unsigned NOT NULL,
  PRIMARY KEY (skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
