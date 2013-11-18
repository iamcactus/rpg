USE game_master;

DROP TABLE IF EXISTS seq_player_unit;
CREATE TABLE seq_player_unit (
  id  int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'playerUnitId',
  PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
insert into seq_player_unit values(10000);
