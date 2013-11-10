USE game_master;
#Drop table if exists card_skill;
CREATE TABLE card_skill (
  card_id   int(10) unsigned NOT NULL,
  skill_id  int(10) unsigned NOT NULL,
  PRIMARY KEY (card_id, skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
