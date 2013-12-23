USE game_master;

DROP TABLE IF EXISTS nature_data;
CREATE TABLE nature_data (
  nature_id   int(10) unsigned NOT NULL,
  type        tinyint(3) unsigned NOT NULL,
  target      tinyint(3) unsigned NOT NULL, # 效果对象
  property    tinyint(3) unsigned NOT NULL, # 技能属性例如攻防血敏
  effect      tinyint(3) unsigned NOT NULL, # 发动效果百分比
  opened_on   int(10) unsigned NOT NULL,
  PRIMARY KEY (nature_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
