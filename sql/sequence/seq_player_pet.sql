USE game_master;

DROP TABLE IF EXISTS seq_player_pet;
CREATE TABLE seq_player_pet (
  id  bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'playerPetId',
  PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
insert into seq_player_pet values(10000);
