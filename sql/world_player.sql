USE game_master;

DROP TABLE IF EXISTS world_player;
CREATE TABLE world_player (
  uid             int(10) unsigned NOT NULL, # uid in login_data
  world_id        int(10) unsigned NOT NULL, # id in world_data
  player_id       int(10) unsigned NOT NULL, # all players ID are created here
  created_on      int(10) unsigned NOT NULL COMMENT '注册日期, unixtime',
  UNIQUE KEY `on_uid_and_world_id` (uid, world_id),
  KEY `on_world_id` (world_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

