USE game_world_1001;

Drop table if exists player_data;
CREATE TABLE player_data (
  id          int(10) unsigned NOT NULL COMMENT 'player id',
  uid         int(10) unsigned NOT NULL COMMENT 'user id',
  name        varchar(16) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'nickname',
  sex_type    tinyint NOT NULL DEFAULT 0 COMMENT '1, male; 0, female',
  created_on  int(10) unsigned NOT NULL COMMENT '注册日期, unixtime',
  PRIMARY KEY (id),
  KEY `on_uid` (uid),
  KEY `on_name` (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
