USE game_master;

DROP TABLE IF EXISTS seq_player_card;
CREATE TABLE seq_player_card (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'playerCardId',
  PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
insert into seq_player_card values(10000);
