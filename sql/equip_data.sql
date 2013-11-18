USE game_master;

#DROP TABLE IF EXISTS equip_data;
CREATE TABLE equip_data (
  equip_id    int(10) unsigned NOT NULL,
  type        tinyint(3) unsigned NOT NULL, # 武防鞋饰
  star        tinyint(3) unsigned NOT NULL, # 星级
  group_id    int(10) unsigned DEFAULT NULL, # 套装组合
  initial     int(10) unsigned NOT NULL,
  price       int(10) unsigned NOT NULL,
  apstar      tinyint(3) unsigned NOT NULL, # 附加属性之星级
  apstpye     tinyint(3) unsigned NOT NULL, # 附加属性之类别
  apinit      int(10) unsigned NOT NULL,  # 附加属性之效果
  opened_on   int(10) unsigned NOT NULL,
  PRIMARY KEY (equip_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
