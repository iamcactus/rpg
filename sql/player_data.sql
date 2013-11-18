USE game_world_1001;

#DROP TABLE IF EXISTS player_data;
CREATE TABLE player_data (
  player_id   int(10) unsigned NOT NULL COMMENT '主角ID',
  name        varchar(16) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '主角昵称',
  sex_type    tinyint NOT NULL DEFAULT 0 COMMENT '1, male; 0, female',
  created_on  int(10) unsigned NOT NULL COMMENT '注册日期, unixtime',
  PRIMARY KEY (player_id),
  KEY `on_name` (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
