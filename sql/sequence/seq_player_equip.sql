USE game_master;

DROP TABLE IF EXISTS seq_player_equip;
CREATE TABLE seq_player_equip (
  id  bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'playerEquipId',
  PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
insert into seq_player_equip values(10000);
