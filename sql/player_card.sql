USE game_world_1001;

DROP TABLE IF EXISTS player_card;
CREATE TABLE player_card (
  id          int(20) unsigned NOT NULL, # serial number
  player_id   int(10) unsigned NOT NULL, # player_id in player_data
  card_id     int(10) unsigned NOT NULL, # card_id in card_data
  exp         int(10) unsigned NOT NULL,
  level       int(10) unsigned NOT NULL,
  evolved_cnt tinyint(3) unsigned NOT NULL DEFAULT 0, # 进化次数
  max_level   int(10) unsigned NOT NULL,
  is_onarm    tinyint(3) unsigned NOT NULL DEFAULT 0, # 上阵
  created_on  int(10) unsigned NOT NULL,
  updated_on  int(10) unsigned NOT NULL,
  PRIMARY KEY (id),
  KEY on_player_id (player_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
