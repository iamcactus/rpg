USE game_world_1001;

DROP TABLE IF EXISTS seq_player_skill;
CREATE TABLE seq_player_skill (
  id  int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'playerSkillId',
  PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
insert into seq_player_skill values(10000);
