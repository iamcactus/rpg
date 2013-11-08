USE game_user;
DROP TABLE IF EXISTS `seq_login_data`;
CREATE TABLE seq_login_data (
  id int(10) unsigned not null
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

insert into seq_login_data values (1);
