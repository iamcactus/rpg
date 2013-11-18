USE game_master;

#DROP TABLE IF EXISTS pet_data;
CREATE TABLE pet_data (
  pet_id      int(10) unsigned NOT NULL,
  star        tinyint(3) unsigned NOT NULL,
  skill_k     int(10) unsigned NOT NULL, # 天生技能
  price       int(10) unsigned NOT NULL,
  logo_id     int(10) unsigned NOT NULL,
  opened_on   int(10) unsigned NOT NULL,
  PRIMARY KEY (pet_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
