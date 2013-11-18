USE game_master;

DROP TABLE IF EXISTS seq_user;
CREATE TABLE seq_user (
  id  int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'userId',
  PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
insert into seq_user values(10000);
