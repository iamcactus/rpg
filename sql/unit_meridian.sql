USE game_world_1001;

#DROP TABLE IF EXISTS unit_meridian;
CREATE TABLE unit_meridian (
  player_card_id     int(10) unsigned NOT NULL, # id in player_card
  m1_st       tinyint(10) unsigned NOT NULL DEFAULT 0, # TianTing
  m2_st       tinyint(10) unsigned NOT NULL DEFAULT 0, # RenMai
  m3_st       tinyint(10) unsigned NOT NULL DEFAULT 0, # DuMai
  m4_st       tinyint(10) unsigned NOT NULL DEFAULT 0, # DaiMai
  m5_st       tinyint(10) unsigned NOT NULL DEFAULT 0, # ChongMai
  m1_stong_id int(10) unsigned DEFAULT NULL, 
  m2_stong_id int(10) unsigned DEFAULT NULL,
  m3_stong_id int(10) unsigned DEFAULT NULL,
  m4_stong_id int(10) unsigned DEFAULT NULL,
  m5_stong_id int(10) unsigned DEFAULT NULL,
  created_on  int(10) unsigned NOT NULL,
  updated_on  int(10) unsigned NOT NULL,
  KEY on_player_card_id (player_card_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

