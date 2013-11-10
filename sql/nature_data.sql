USE game_master;
#Drop table if exists nature_data;
CREATE TABLE nature_data (
  nature_id    int(10) unsigned NOT NULL,
  name        varchar(255) NOT NULL,
  type        tinyint(3) unsigned NOT NULL,
  target      tinyint(3) unsigned NOT NULL, # 效果对象
  price       int(10) unsigned NOT NULL,
  property    tinyint(3) unsigned NOT NULL, # 技能属性例如攻防血敏
  effect      tinyint(3) unsigned NOT NULL, # 发动效果百分比
  desc        varchar(255) NOT NULL,
  opened_on   int(10) unsigned NOT NULL,
  PRIMARY KEY (nature_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
