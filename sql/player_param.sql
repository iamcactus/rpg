USE game_world_1001;

DROP TABLE IF EXISTS player_param;
CREATE TABLE player_param (
  player_id   int(10) unsigned NOT NULL COMMENT '主角ID',
  exp         int(10) unsigned NOT NULL DEFAULT 0 COMMENT '当前经验',
  level       int(10) unsigned NOT NULL DEFAULT 1 COMMENT '当前等级',
  max_power   int(10) unsigned NOT NULL COMMENT '最大体力',
  power_recovered_on  int(10) unsigned NOT NULL DEFAULT 0 COMMENT '最大体力恢复日期',
  max_energy  int(10) unsigned NOT NULL COMMENT '最大精力',
  energy_recovered_on int(10) unsigned NOT NULL DEFAULT 0 COMMENT '最大精力恢复日期',
  lead        int(10) unsigned NOT NULL DEFAULT 0 COMMENT '当前统治力',
  power       int(10) unsigned NOT NULL DEFAULT 0 COMMENT '当前体力',
  energy      int(10) unsigned NOT NULL DEFAULT 0 COMMENT '当前精力',
  updated_on  int(10) unsigned NOT NULL DEFAULT 0 COMMENT '更新日期'
  PRIMARY KEY (player_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
