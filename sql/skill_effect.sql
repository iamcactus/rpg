USE game_master;
#Drop table if exists skill_effect;
CREATE TABLE skill_effect (
  skill_id    int(10) unsigned NOT NULL,
  level       tinyint(3) unsigned NOT NULL, # 技能等级
  success     tinyint(3) unsigned NOT NULL, # 发动几率
  effect      tinyint(3) unsigned NOT NULL, # 发动效果百分比
  property    tinyint(3) unsigned NOT NULL, # 技能属性例如攻防
  scale       tinyint(3) unsigned NOT NULL, # 发动效果例如微弱普通巨大
  price       int(10) unsigned NOT NULL,
  desc        varchar(255) NOT NULL,
  opened_on   int(10) unsigned NOT NULL,
  PRIMARY KEY (skill_id, level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
