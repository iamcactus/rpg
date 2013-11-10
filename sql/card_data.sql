USE game_master;
#Drop table if exists card_data;
CREATE TABLE card_data (
  card_id     int(10) unsigned NOT NULL,
  name        varchar(255) NOT NULL,
  type        tinyint(3) unsigned NOT NULL,
  role        tinyint(3) unsigned NOT NULL,
  star        tinyint(3) unsigned NOT NULL,
  hp_c        int(10) unsigned NOT NULL,
  atk_c       int(10) unsigned NOT NULL,
  def_c       int(10) unsigned NOT NULL,
  agi_c       int(10) unsigned NOT NULL,
  skill_k     int(10) unsigned NOT NULL, # 天生技能
  price       int(10) unsigned NOT NULL,
  logo_id     int(10) unsigned NOT NULL,
  desc        varchar(255) NOT NULL,
  opened_on   int(10) unsigned NOT NULL
  PRIMARY KEY (card_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
