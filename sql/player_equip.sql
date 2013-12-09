USE game_world_1001;

DROP TABLE IF EXISTS player_equip;
CREATE TABLE player_equip (
  id          int(20) unsigned NOT NULL, # serial number
  player_id   int(10) unsigned NOT NULL, # player_id in player_data
  equip_id    int(10) unsigned NOT NULL, # equip_id in equip_data
  level       int(10) unsigned NOT NULL, 
  type        tinyint(3) unsigned NOT NULL, # 武防鞋饰
  is_onarm    tinyint(3) unsigned NOT NULL DEFAULT 0, # 装备中与否
  price       int(10) unsigned NOT NULL,
  created_on  int(10) unsigned NOT NULL,
  updated_on  int(10) unsigned NOT NULL,
  PRIMARY KEY (id),
  KEY on_player_id_and_is_onarm (player_id, is_onarm)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
