USE game_master;

DROP TABLE IF EXISTS mission_data;
CREATE TABLE mission_data (
  id          int(10) unsigned NOT NULL AUTO_INCREMENT, # serial id
  map_id      int(10) unsigned NOT NULL, # 章节ID
  mission_id  int(10) unsigned NOT NULL, 
  is_talk     int(10) unsigned NOT NULL,
  pic         int(10) unsigned NOT NULL,
  power       int(10) unsigned NOT NULL,
  exp         int(10) unsigned NOT NULL,
  petexp      int(10) unsigned NOT NULL,
  silver      int(10) unsigned NOT NULL, # 掉落银元
  counter     int(10) unsigned NOT NULL, # 日均战斗上限
  skill_lv    tinyint(3) unsigned NOT NULL,
  is_boss     tinyint(3) unsigned NOT NULL, # 是否是boss
  crit_addon  int(10) unsigned NOT NULL, # 暴击
  block_addon int(10) unsigned NOT NULL, # 格挡
  dodge_addon int(10) unsigned NOT NULL, # 闪避
  hit_addon   int(10) unsigned NOT NULL, # 命中
  ctatk_addon int(10) unsigned NOT NULL, # 反击
  kill_addon  int(10) unsigned NOT NULL, # 必杀
  opened_on   int(10) unsigned NOT NULL,
  PRIMARY KEY (id),
  KEY on_map_id_and_mission_id (map_id, mission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
