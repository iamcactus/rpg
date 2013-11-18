USE game_master;

#DROP TABLE IF EXISTS card_skill;
CREATE TABLE card_skill (
  card_id   int(10) unsigned NOT NULL, # card_id in card_data
  skill_id  int(10) unsigned NOT NULL, # skill_id in skill_data
  PRIMARY KEY (card_id, skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
