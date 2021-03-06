USE game_master;

DROP TABLE IF EXISTS card_data;
CREATE TABLE card_data (
  card_id     int(10) unsigned NOT NULL,
  type        tinyint(3) unsigned NOT NULL,
  role        tinyint(3) unsigned NOT NULL,
  star        tinyint(3) unsigned NOT NULL,
  hp_c        int(10) unsigned NOT NULL,
  atk_c       int(10) unsigned NOT NULL,
  def_c       int(10) unsigned NOT NULL,
  agi_c       int(10) unsigned NOT NULL,
  skill_k     int(10) unsigned NOT NULL, # 天生技能,nature_id in nature_data
  price       int(10) unsigned NOT NULL,
  hidden      tinyint(3) unsigned NOT NULL DEFAULT 0, # show or not
  special     tinyint(3) unsigned NOT NULL DEFAULT 0, # special card cant be got by free coin
  logo_id     int(10) unsigned NOT NULL,
  opened_on   int(10) unsigned NOT NULL,
  PRIMARY KEY (card_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
