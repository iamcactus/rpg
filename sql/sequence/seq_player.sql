USE game_master;

DROP TABLE IF EXISTS seq_player;
CREATE TABLE seq_player (
  id  int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'playerId',
  PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
insert into seq_player values(10000);
