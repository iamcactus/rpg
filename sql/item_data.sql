USE game_master;

DROP TABLE IF EXISTS item_data;
CREATE TABLE item_data (
  item_id    int(10) unsigned NOT NULL,
  star        tinyint(3) unsigned NOT NULL, # 星级
  max         tinyint(3) unsigned DEFAULT 99, # 最多拥有数量
  use_lv      tinyint(3) unsigned DEFAULT 0, # 使用等级条件
  price       int(10) unsigned NOT NULL,
  opened_on   int(10) unsigned NOT NULL,
  effect      varchar(80) DEFAULT NULL,
  comment     varchar(80) DEFAULT NULL, # type in Prop.lua
  PRIMARY KEY (item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
