USE game_master;

DROP TABLE IF EXISTS seq_login;
CREATE TABLE seq_login (
  id  int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'uid',
  PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
insert into seq_login values(10000);
