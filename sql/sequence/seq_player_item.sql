USE game_master;

DROP TABLE IF EXISTS seq_player_item;
CREATE TABLE seq_player_item (
  id  bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'playerItemId',
  PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
insert into seq_player_item values(10000);
