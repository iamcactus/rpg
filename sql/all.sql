use game_world_1001;
#alter table player_param add vip_level   tinyint(3) unsigned NOT NULL DEFAULT 0 COMMENT '当前VIP等级' after player_id;
alter table player_param add mission_data_id int(10) unsigned NOT NULL DEFAULT 1 COMMENT '当前关卡ID' after level;
alter table player_param add gold        int(10) unsigned NOT NULL DEFAULT 0 COMMENT '元宝' after mission_data_id;
alter table player_param add silver      int(10) unsigned NOT NULL DEFAULT 0 COMMENT '银两' after gold;


USE game_master;

DROP TABLE IF EXISTS card_data;
CREATE TABLE card_data (
  card_id     int(10) unsigned NOT NULL,
  type        tinyint(3) unsigned NOT NULL,
  role        tinyint(3) unsigned NOT NULL,
  star        tinyint(3) unsigned NOT NULL,
  hp_c        int(10) unsigned NOT NULL,
  atk_c       int(10) unsigned NOT NULL,
  def_c       int(10) unsigned NOT NULL,
  agi_c       int(10) unsigned NOT NULL,
  skill_k     int(10) unsigned NOT NULL, # 天生技能,nature_id in nature_data
  price       int(10) unsigned NOT NULL,
  logo_id     int(10) unsigned NOT NULL,
  opened_on   int(10) unsigned NOT NULL,
  PRIMARY KEY (card_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

USE game_master;

DROP TABLE IF EXISTS card_skill;
CREATE TABLE card_skill (
  card_id   int(10) unsigned NOT NULL, # card_id in card_data
  skill_id  int(10) unsigned NOT NULL, # skill_id in skill_data
  PRIMARY KEY (card_id, skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

USE game_master;

DROP TABLE IF EXISTS equip_data;
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

USE game_master;

DROP TABLE IF EXISTS item_data;
CREATE TABLE item_data (
  item_id    int(10) unsigned NOT NULL,
  type        tinyint(3) unsigned NOT NULL, # 武防鞋饰等
  star        tinyint(3) unsigned NOT NULL, # 星级
  max         tinyint(3) unsigned DEFAULT 99, # 最多拥有数量
  use_lv      tinyint(3) unsigned DEFAULT 0, # 使用等级条件
  price       int(10) unsigned NOT NULL,
  opened_on   int(10) unsigned NOT NULL,
  PRIMARY KEY (item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

USE game_master;
Drop table if exists login_data;
CREATE TABLE login_data (
  uid     int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户id',
  device_info varchar(80) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '快速游戏之客户端唯一信息',
  login_name  varchar(80) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '帐号名',
  password_hash varchar(255) NOT NULL COMMENT '加密后的帐号密码',
  created_on  int(10) unsigned NOT NULL COMMENT '注册日期, unixtime',
  PRIMARY KEY (uid),
  UNIQUE KEY `on_login_name` (login_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into login_data (uid, device_info, login_name, password_hash, created_on)
values(1, "staff001", "staff001", "onemore001", 1383115317);

insert into login_data (device_info, login_name, password_hash, created_on)
values("staff002", "staff002", "onemore002", 1383115318);

USE game_master;

DROP TABLE IF EXISTS map_data;
CREATE TABLE map_data (
  map_id      int(10) unsigned NOT NULL,
  opened_on   int(10) unsigned NOT NULL,
  PRIMARY KEY (map_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

USE game_master;

DROP TABLE IF EXISTS mission_award;
CREATE TABLE mission_award (
  mission_data_id    int(10) unsigned NOT NULL, # id in mission_data
  award_id      int(10) unsigned NOT NULL, # 奖励之道具ID
  PRIMARY KEY (mission_data_id, award_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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

USE game_master;

DROP TABLE IF EXISTS mission_npc;
CREATE TABLE mission_npc (
  mission_data_id int(10) unsigned NOT NULL, # id in mission_data
  npc_id          int(10) unsigned NOT NULL,
  position_id     tinyint(3)  unsigned NOT NULL,
  PRIMARY KEY (mission_data_id, npc_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

USE game_master;

DROP TABLE IF EXISTS nature_condition;
CREATE TABLE nature_condition (
  nature_id   int(10) unsigned NOT NULL,
  card_id     int(10) unsigned NOT NULL,
  opened_on   int(10) unsigned NOT NULL,
  PRIMARY KEY (card_id, nature_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

USE game_master;

DROP TABLE IF EXISTS nature_data;
CREATE TABLE nature_data (
  nature_id   int(10) unsigned NOT NULL,
  type        tinyint(3) unsigned NOT NULL,
  target      tinyint(3) unsigned NOT NULL, # 效果对象
  price       int(10) unsigned NOT NULL,
  property    tinyint(3) unsigned NOT NULL, # 技能属性例如攻防血敏
  effect      tinyint(3) unsigned NOT NULL, # 发动效果百分比
  opened_on   int(10) unsigned NOT NULL,
  PRIMARY KEY (nature_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

USE game_master;

DROP TABLE IF EXISTS npc_data;
CREATE TABLE npc_data (
  npc_id    int(10) unsigned NOT NULL,
  gid       int(10) unsigned NOT NULL,
  logo_id   int(10) unsigned NOT NULL,
  PRIMARY KEY (npc_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

USE game_master;

DROP TABLE IF EXISTS pet_data;
CREATE TABLE pet_data (
  pet_id      int(10) unsigned NOT NULL,
  star        tinyint(3) unsigned NOT NULL,
  skill_k     int(10) unsigned NOT NULL, # 天生技能
  price       int(10) unsigned NOT NULL,
  logo_id     int(10) unsigned NOT NULL,
  opened_on   int(10) unsigned NOT NULL,
  PRIMARY KEY (pet_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

USE game_master;

DROP TABLE IF EXISTS pet_skill_data;
CREATE TABLE pet_skill_data (
  skill_id    int(10) unsigned NOT NULL,
  department  tinyint(3) unsigned NOT NULL, # 水火风雷
  type        tinyint(3) unsigned NOT NULL,
  sk_trigger  tinyint(3) unsigned NOT NULL, # 1, 主动技能, 2, 被动技能
  target      tinyint(3) unsigned NOT NULL, # numpeople
  star        tinyint(3) unsigned NOT NULL,
  keep        tinyint(3) unsigned NOT NULL,
  price       int(10) unsigned NOT NULL,
  effect_id   int(10) unsigned NOT NULL,
  opened_on   int(10) unsigned NOT NULL,
  PRIMARY KEY (skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

USE game_master;

DROP TABLE IF EXISTS pet_skill_effect;
CREATE TABLE pet_skill_effect (
  id          int(10) unsigned NOT NULL, # serial number
  skill_id    int(10) unsigned NOT NULL, # skill_id in skill_data
  level       tinyint(3) unsigned NOT NULL, # 技能等级
  success     tinyint(3) unsigned NOT NULL, # 附属效果发生几率
  max_sp      tinyint(3) unsigned NOT NULL, # 幻兽攻击力的伤害比例
  debuff      tinyint(3) unsigned NOT NULL, # 附属效果的效果比例
  opened_on   int(10) unsigned NOT NULL,
  PRIMARY KEY (id),
  KEY on_skill_id_and_level (skill_id, level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

USE game_world_1001;

DROP TABLE IF EXISTS pet_unit;
CREATE TABLE pet_unit (
  player_pet_id int(20) unsigned NOT NULL, # id in player_pet
  level       int(10) unsigned NOT NULL,
  evolved_cnt tinyint(3) unsigned NOT NULL DEFAULT 0, # 进化次数
  max_level   int(10) unsigned NOT NULL,
  posi_skill1_id int(10) unsigned DEFAULT NULL, # 主动技能1, id in pet_skill_effect
  posi_skill2_id int(10) unsigned DEFAULT NULL, # 主动技能2
  posi_skill3_id int(10) unsigned DEFAULT NULL, # 主动技能3
  nega_skill1_id int(10) unsigned DEFAULT NULL, # 被动技能1
  nega_skill2_id int(10) unsigned DEFAULT NULL, # 被动技能2
  nega_skill3_id int(10) unsigned DEFAULT NULL, # 被动技能3
  is_teamed   tinyint(10) unsigned NOT NULL DEFAULT 0, # 上阵中与否
  created_on  int(10) unsigned NOT NULL,
  updated_on  int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (player_pet_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

USE game_world_1001;

DROP TABLE IF EXISTS player_card;
CREATE TABLE player_card (
  id          int(20) unsigned NOT NULL, # serial number
  player_id   int(10) unsigned NOT NULL, # player_id in player_data
  card_id     int(10) unsigned NOT NULL, # card_id in card_data
  exp         int(10) unsigned NOT NULL,
  level       int(10) unsigned NOT NULL,
  evolved_cnt tinyint(3) unsigned NOT NULL, # 进化次数
  stdskill1_id  int(10) unsigned DEFAULT NULL, # id in skill_effect
  stdskill2_id  int(10) unsigned DEFAULT NULL, # id in skill_effect
  max_level   int(10) unsigned NOT NULL,
  created_on  int(10) unsigned NOT NULL,
  updated_on  int(10) unsigned NOT NULL,
  PRIMARY KEY (id),
  KEY on_player_id (player_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

USE game_world_1001;

DROP TABLE IF EXISTS player_data;
CREATE TABLE player_data (
  player_id   int(10) unsigned NOT NULL COMMENT '主角ID',
  name        varchar(16) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '主角昵称',
  sex_type    tinyint NOT NULL DEFAULT 0 COMMENT '1, male; 0, female',
  created_on  int(10) unsigned NOT NULL COMMENT '注册日期, unixtime',
  PRIMARY KEY (player_id),
  KEY `on_name` (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
  KEY on_player_id (player_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


USE game_world_1001;

DROP TABLE IF EXISTS player_item;
CREATE TABLE player_item (
  id          int(20) unsigned NOT NULL, # serial number
  player_id   int(10) unsigned NOT NULL, # player_id in player_data
  item_id     int(10) unsigned NOT NULL, # equip_id in equip_data
  num         int(10) unsigned NOT NULL,
  created_on  int(10) unsigned NOT NULL,
  updated_on  int(10) unsigned NOT NULL,
  PRIMARY KEY on_player_id (player_id, item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

USE game_world_1001;

Drop TABLE IF EXISTS player_mission_log;
CREATE TABLE player_mission_log (
  player_id   int(10) unsigned NOT NULL,
  mission_data_id  int(10) unsigned NOT NULL, # id in mission_data
  clear_num   int(10) unsigned NOT NULL DEFAULT 0,
  rate        tinyint(3) unsigned NOT NULL DEFAULT 0,
  created_on  int(10) unsigned NOT NULL,
  updated_on  int(10) unsigned NOT NULL,
  PRIMARY KEY (player_id, mission_data_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

USE game_world_1001;

DROP TABLE IF EXISTS player_param;
CREATE TABLE player_param (
  player_id   int(10) unsigned NOT NULL COMMENT '主角ID',
  vip_level   tinyint(3) unsigned NOT NULL DEFAULT 0 COMMENT '当前VIP等级',
  exp         int(10) unsigned NOT NULL DEFAULT 0 COMMENT '当前经验',
  level       int(10) unsigned NOT NULL DEFAULT 1 COMMENT '当前等级',
  mission_data_id int(10) unsigned NOT NULL DEFAULT 1 COMMENT '当前关卡ID',
  gold        int(10) unsigned NOT NULL DEFAULT 0 COMMENT '元宝',
  silver      int(10) unsigned NOT NULL DEFAULT 0 COMMENT '银两',
  max_power   int(10) unsigned NOT NULL COMMENT '最大体力',
  power_recovered_on  int(10) unsigned NOT NULL DEFAULT 0 COMMENT '最大体力恢复日期',
  max_energy  int(10) unsigned NOT NULL COMMENT '最大精力',
  energy_recovered_on int(10) unsigned NOT NULL DEFAULT 0 COMMENT '最大精力恢复日期',
  lead        int(10) unsigned NOT NULL DEFAULT 0 COMMENT '当前统治力',
  power       int(10) unsigned NOT NULL DEFAULT 0 COMMENT '当前体力',
  energy      int(10) unsigned NOT NULL DEFAULT 0 COMMENT '当前精力',
  updated_on  int(10) unsigned NOT NULL DEFAULT 0 COMMENT '更新日期',
  PRIMARY KEY (player_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

USE game_world_1001;

DROP TABLE IF EXISTS player_pet;
CREATE TABLE player_pet (
  id          int(20) unsigned NOT NULL, # serial number
  player_id   int(10) unsigned NOT NULL, # player_id in player_data
  pet_id      int(10) unsigned NOT NULL, # pet_id in pet_data
  created_on  int(10) unsigned NOT NULL,
  updated_on  int(10) unsigned NOT NULL,
  PRIMARY KEY (id),
  KEY on_player_id (player_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

USE game_world_1001;

DROP TABLE IF EXISTS player_skill;
CREATE TABLE player_skill (
  id          int(20) unsigned NOT NULL, #serial number
  player_id   int(10) unsigned NOT NULL, # id in player_data
  skill_id    int(10) unsigned NOT NULL, # id in skill_data
  exp         int(10) unsigned NOT NULL,
  level       tinyint(10) unsigned NOT NULL,
  max_level   int(10) unsigned NOT NULL,
  created_on  int(10) unsigned NOT NULL,
  updated_on  int(10) unsigned NOT NULL,
  PRIMARY KEY (id),
  KEY on_player_id (player_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

USE game_world_1001;

DROP TABLE IF EXISTS player_unit;
CREATE TABLE player_unit (
  player_id  int(10) unsigned NOT NULL, # player_id in player_data
  position_id     tinyint(3) unsigned NOT NULL, # 队伍位置 1-8
  player_card_id  int(10) unsigned NOT NULL, # id in player_card
  weapon_id   int(10) unsigned DEFAULT NULL, # equip_id in player_equip
  defender_id int(10) unsigned DEFAULT NULL, # equip_id in player_equip
  shoe_id     int(10) unsigned DEFAULT NULL, # equip_id in player_equip
  jewelry_id  int(10) unsigned DEFAULT NULL, # equip_id in player_equip
  created_on  int(10) unsigned NOT NULL,
  updated_on  int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (player_id, position_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

USE game_master;

DROP TABLE IF EXISTS skill_data;
CREATE TABLE skill_data (
  skill_id    int(10) unsigned NOT NULL,
  type        tinyint(3) unsigned NOT NULL,
  target      tinyint(3) unsigned NOT NULL,
  star        tinyint(3) unsigned NOT NULL,
  hide        tinyint(3) unsigned NOT NULL,
  needid      int(10) unsigned NOT NULL,
  price       int(10) unsigned NOT NULL,
  effect_id   int(10) unsigned NOT NULL,
  opened_on   int(10) unsigned NOT NULL,
  PRIMARY KEY (skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

USE game_master;

DROP TABLE IF EXISTS skill_effect;
CREATE TABLE skill_effect (
  id          int(10) unsigned NOT NULL, # serial number
  skill_id    int(10) unsigned NOT NULL, # skill_id in skill_data
  level       tinyint(3) unsigned NOT NULL, # 技能等级
  success     tinyint(3) unsigned NOT NULL, # 发动几率
  effect      tinyint(3) unsigned NOT NULL, # 发动效果百分比
  property    tinyint(3) unsigned NOT NULL, # 技能属性例如攻防
  scale       tinyint(3) unsigned NOT NULL, # 发动效果例如微弱普通巨大
  opened_on   int(10) unsigned NOT NULL,
  PRIMARY KEY (id),
  KEY on_skill_id_and_level (skill_id, level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

USE game_world_1001;

DROP TABLE IF EXISTS unit_meridian;
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


USE game_master;

DROP TABLE IF EXISTS world_data;
CREATE TABLE world_data (
  id              int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '世界id',
  name            varchar(80) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '世界名',
  population_st   tinyint NOT NULL DEFAULT 0 COMMENT '0, empty; 1, crowd; 2, full',
  device_id       tinyint NOT NULL DEFAULT 1 COMMENT '1, both; 2, android; 3, ios',
  service_st      tinyint NOT NULL DEFAULT 1 COMMENT '1, online; 0, offline',
  created_on      int(10) unsigned NOT NULL COMMENT '注册日期, unixtime',
  PRIMARY KEY (id),
  UNIQUE KEY `on_device_id` (device_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into world_data (id, name, created_on)
values(1, "僵尸农村", 1383115317);


USE game_master;

DROP TABLE IF EXISTS world_player;
CREATE TABLE world_player (
  uid             int(10) unsigned NOT NULL, # uid in login_data
  world_id        int(10) unsigned NOT NULL, # id in world_data
  player_id       int(10) unsigned NOT NULL, # all players ID are created here
  created_on      int(10) unsigned NOT NULL COMMENT '注册日期, unixtime',
  UNIQUE KEY `on_uid_and_world_id` (uid, world_id),
  KEY `on_world_id` (world_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
USE game_master;

DROP TABLE IF EXISTS seq_player;
CREATE TABLE seq_player (
  id  int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'playerId',
  PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
insert into seq_player values(10000);

USE game_master;

DROP TABLE IF EXISTS seq_user;
CREATE TABLE seq_user (
  id  int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'userId',
  PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
insert into seq_user values(10000);


USE game_world_1001;

DROP TABLE IF EXISTS seq_player_card;
CREATE TABLE seq_player_card (
  id  int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'playerCardId',
  PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
insert into seq_player_card values(10000);

USE game_world_1001;

DROP TABLE IF EXISTS seq_player_equip;
CREATE TABLE seq_player_equip (
  id  int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'playerEquipId',
  PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
insert into seq_player_equip values(10000);

USE game_world_1001;

DROP TABLE IF EXISTS seq_player_item;
CREATE TABLE seq_player_item (
  id  int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'playerItemId',
  PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
insert into seq_player_item values(10000);

USE game_world_1001;

DROP TABLE IF EXISTS seq_player_pet;
CREATE TABLE seq_player_pet (
  id  int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'playerPetId',
  PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
insert into seq_player_pet values(10000);

USE game_world_1001;

DROP TABLE IF EXISTS seq_player_skill;
CREATE TABLE seq_player_skill (
  id  int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'playerSkillId',
  PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
insert into seq_player_skill values(10000);

use game_master;
insert into mission_award (mission_data_id, award_id) values(5, 5102);
insert into mission_award (mission_data_id, award_id) values(9, 5104);
insert into mission_award (mission_data_id, award_id) values(11, 5103);
insert into mission_award (mission_data_id, award_id) values(14, 5102);
insert into mission_award (mission_data_id, award_id) values(15, 5102);
insert into mission_award (mission_data_id, award_id) values(19, 5106);
insert into mission_award (mission_data_id, award_id) values(22, 5201);
insert into mission_award (mission_data_id, award_id) values(27, 5204);
insert into mission_award (mission_data_id, award_id) values(28, 5202);

use game_master;
insert into mission_npc (mission_data_id, npc_id, position_id) values(1, 18032, 1);
insert into mission_npc (mission_data_id, npc_id, position_id) values(2, 18033, 1);
insert into mission_npc (mission_data_id, npc_id, position_id) values(3, 18034, 1);
insert into mission_npc (mission_data_id, npc_id, position_id) values(4, 18035, 1);
insert into mission_npc (mission_data_id, npc_id, position_id) values(5, 18141, 1);

insert into mission_npc (mission_data_id, npc_id, position_id) values(6, 18037, 1);
insert into mission_npc (mission_data_id, npc_id, position_id) values(6, 18038, 2);
insert into mission_npc (mission_data_id, npc_id, position_id) values(7, 18039, 1);
insert into mission_npc (mission_data_id, npc_id, position_id) values(7, 18040, 2);
insert into mission_npc (mission_data_id, npc_id, position_id) values(8, 18041, 1);
insert into mission_npc (mission_data_id, npc_id, position_id) values(8, 18040, 2);
insert into mission_npc (mission_data_id, npc_id, position_id) values(9, 18033, 1);
insert into mission_npc (mission_data_id, npc_id, position_id) values(9, 18036, 2);
insert into mission_npc (mission_data_id, npc_id, position_id) values(10, 18034, 1);
insert into mission_npc (mission_data_id, npc_id, position_id) values(10, 18038, 2);
insert into mission_npc (mission_data_id, npc_id, position_id) values(11, 18039, 1);
insert into mission_npc (mission_data_id, npc_id, position_id) values(11, 18135, 2);

insert into mission_npc (mission_data_id, npc_id, position_id) values(12, 18047, 1);
insert into mission_npc (mission_data_id, npc_id, position_id) values(12, 18048, 2);
insert into mission_npc (mission_data_id, npc_id, position_id) values(12, 18049, 3);
insert into mission_npc (mission_data_id, npc_id, position_id) values(13, 18048, 1);
insert into mission_npc (mission_data_id, npc_id, position_id) values(13, 18049, 2);
insert into mission_npc (mission_data_id, npc_id, position_id) values(13, 18050, 3);
insert into mission_npc (mission_data_id, npc_id, position_id) values(14, 18049, 1);
insert into mission_npc (mission_data_id, npc_id, position_id) values(14, 18050, 2);
insert into mission_npc (mission_data_id, npc_id, position_id) values(14, 18051, 3);

insert into mission_npc (mission_data_id, npc_id, position_id) values(15, 18050, 1);
insert into mission_npc (mission_data_id, npc_id, position_id) values(15, 18051, 2);
insert into mission_npc (mission_data_id, npc_id, position_id) values(15, 18159, 3);

insert into mission_npc (mission_data_id, npc_id, position_id) values(16, 18051, 1);
insert into mission_npc (mission_data_id, npc_id, position_id) values(16, 18052, 2);
insert into mission_npc (mission_data_id, npc_id, position_id) values(16, 18053, 3);
insert into mission_npc (mission_data_id, npc_id, position_id) values(17, 18052, 1);
insert into mission_npc (mission_data_id, npc_id, position_id) values(17, 18053, 2);
insert into mission_npc (mission_data_id, npc_id, position_id) values(17, 18054, 3);
insert into mission_npc (mission_data_id, npc_id, position_id) values(18, 18053, 1);
insert into mission_npc (mission_data_id, npc_id, position_id) values(18, 18054, 2);
insert into mission_npc (mission_data_id, npc_id, position_id) values(18, 18055, 3);
insert into mission_npc (mission_data_id, npc_id, position_id) values(19, 18047, 1);
insert into mission_npc (mission_data_id, npc_id, position_id) values(19, 18156, 2);
insert into mission_npc (mission_data_id, npc_id, position_id) values(19, 18058, 3);
insert into mission_npc (mission_data_id, npc_id, position_id) values(20, 18048, 1);
insert into mission_npc (mission_data_id, npc_id, position_id) values(20, 18051, 2);
insert into mission_npc (mission_data_id, npc_id, position_id) values(20, 18054, 3);
insert into mission_npc (mission_data_id, npc_id, position_id) values(21, 18047, 1);
insert into mission_npc (mission_data_id, npc_id, position_id) values(21, 18050, 2);
insert into mission_npc (mission_data_id, npc_id, position_id) values(21, 18056, 3);
insert into mission_npc (mission_data_id, npc_id, position_id) values(22, 18048, 1);
insert into mission_npc (mission_data_id, npc_id, position_id) values(22, 18051, 2);
insert into mission_npc (mission_data_id, npc_id, position_id) values(22, 18158, 3);

insert into mission_npc (mission_data_id, npc_id, position_id) values(23, 18048, 1);
insert into mission_npc (mission_data_id, npc_id, position_id) values(23, 18052, 2);
insert into mission_npc (mission_data_id, npc_id, position_id) values(23, 18056, 3);

insert into mission_npc (mission_data_id, npc_id, position_id) values(24, 18049, 1);
insert into mission_npc (mission_data_id, npc_id, position_id) values(24, 18052, 2);
insert into mission_npc (mission_data_id, npc_id, position_id) values(24, 18054, 3);

insert into mission_npc (mission_data_id, npc_id, position_id) values(25, 18048, 1);
insert into mission_npc (mission_data_id, npc_id, position_id) values(25, 18052, 2);
insert into mission_npc (mission_data_id, npc_id, position_id) values(25, 18054, 3);

insert into mission_npc (mission_data_id, npc_id, position_id) values(26, 18048, 1);
insert into mission_npc (mission_data_id, npc_id, position_id) values(26, 18052, 2);
insert into mission_npc (mission_data_id, npc_id, position_id) values(26, 18056, 3);

insert into mission_npc (mission_data_id, npc_id, position_id) values(27, 18159, 1);
insert into mission_npc (mission_data_id, npc_id, position_id) values(27, 18047, 2);
insert into mission_npc (mission_data_id, npc_id, position_id) values(27, 18050, 3);

insert into mission_npc (mission_data_id, npc_id, position_id) values(28, 18049, 1);
insert into mission_npc (mission_data_id, npc_id, position_id) values(28, 18153, 2);
insert into mission_npc (mission_data_id, npc_id, position_id) values(28, 18051, 3);



use game_master;
insert into mission_data (map_id, mission_id, is_talk, pic, power, exp, petexp, silver, counter, skill_lv, is_boss, crit_addon, block_addon, dodge_addon, hit_addon, ctatk_addon, kill_addon, opened_on)
values(1, 1, 0, 0, 1, 33, 92, 168, 39, 1, 0, 0, 0, 0, 0, 0, 0, 1384847184);
insert into mission_data (map_id, mission_id, is_talk, pic, power, exp, petexp, silver, counter, skill_lv, is_boss, crit_addon, block_addon, dodge_addon, hit_addon, ctatk_addon, kill_addon, opened_on)
values(1, 2, 0, 0, 1, 35, 93, 168, 39, 1, 0, 0, 0, 0, 0, 0, 0, 1384847184);
insert into mission_data (map_id, mission_id, is_talk, pic, power, exp, petexp, silver, counter, skill_lv, is_boss, crit_addon, block_addon, dodge_addon, hit_addon, ctatk_addon, kill_addon, opened_on)
values(1, 3, 0, 0, 1, 37, 94, 168, 39, 1, 0, 0, 0, 0, 0, 0, 0, 1384847184);
insert into mission_data (map_id, mission_id, is_talk, pic, power, exp, petexp, silver, counter, skill_lv, is_boss, crit_addon, block_addon, dodge_addon, hit_addon, ctatk_addon, kill_addon, opened_on)
values(1, 4, 0, 0, 1, 39, 95, 235, 39, 1, 0, 0, 0, 0, 0, 0, 0, 1384847184);
insert into mission_data (map_id, mission_id, is_talk, pic, power, exp, petexp, silver, counter, skill_lv, is_boss, crit_addon, block_addon, dodge_addon, hit_addon, ctatk_addon, kill_addon, opened_on)
values(1, 5, 18103, 0, 1, 69, 96, 302, 10, 1, 1, 0, 0, 0, 0, 0, 0, 1384847184);

insert into mission_data (map_id, mission_id, is_talk, pic, power, exp, petexp, silver, counter, skill_lv, is_boss, crit_addon, block_addon, dodge_addon, hit_addon, ctatk_addon, kill_addon, opened_on)
values(2, 1, 0, 0, 1, 42, 140, 202, 39, 1, 0, 0, 0, 0, 0, 0, 0, 1384847184);
insert into mission_data (map_id, mission_id, is_talk, pic, power, exp, petexp, silver, counter, skill_lv, is_boss, crit_addon, block_addon, dodge_addon, hit_addon, ctatk_addon, kill_addon, opened_on)
values(2, 2, 0, 0, 1, 44, 141, 202, 39, 1, 0, 0, 0, 0, 0, 0, 0, 1384847184);
insert into mission_data (map_id, mission_id, is_talk, pic, power, exp, petexp, silver, counter, skill_lv, is_boss, crit_addon, block_addon, dodge_addon, hit_addon, ctatk_addon, kill_addon, opened_on)
values(2, 3, 0, 0, 1, 46, 142, 202, 39, 1, 0, 0, 0, 0, 0, 0, 0, 1384847184);
insert into mission_data (map_id, mission_id, is_talk, pic, power, exp, petexp, silver, counter, skill_lv, is_boss, crit_addon, block_addon, dodge_addon, hit_addon, ctatk_addon, kill_addon, opened_on)
values(2, 4, 0, 0, 1, 67, 143, 282, 10, 1, 1, 0, 0, 0, 0, 0, 0, 1384847184);
insert into mission_data (map_id, mission_id, is_talk, pic, power, exp, petexp, silver, counter, skill_lv, is_boss, crit_addon, block_addon, dodge_addon, hit_addon, ctatk_addon, kill_addon, opened_on)
values(2, 5, 0, 0, 1, 50, 144, 202, 39, 1, 0, 0, 0, 0, 0, 0, 0, 1384847184);
insert into mission_data (map_id, mission_id, is_talk, pic, power, exp, petexp, silver, counter, skill_lv, is_boss, crit_addon, block_addon, dodge_addon, hit_addon, ctatk_addon, kill_addon, opened_on)
values(2, 6, 0, 0, 1, 88, 145, 363, 5, 1, 1, 0, 0, 0, 0, 0, 0, 1384847184);

insert into mission_data (map_id, mission_id, is_talk, pic, power, exp, petexp, silver, counter, skill_lv, is_boss, crit_addon, block_addon, dodge_addon, hit_addon, ctatk_addon, kill_addon, opened_on)
values(3, 1, 0, 0, 1, 56, 236, 242, 39, 1, 0, 0, 0, 0, 0, 0, 0, 1384847184);
insert into mission_data (map_id, mission_id, is_talk, pic, power, exp, petexp, silver, counter, skill_lv, is_boss, crit_addon, block_addon, dodge_addon, hit_addon, ctatk_addon, kill_addon, opened_on)
values(3, 2, 0, 0, 1, 58, 237, 242, 39, 1, 0, 0, 0, 0, 0, 0, 0, 1384847184);
insert into mission_data (map_id, mission_id, is_talk, pic, power, exp, petexp, silver, counter, skill_lv, is_boss, crit_addon, block_addon, dodge_addon, hit_addon, ctatk_addon, kill_addon, opened_on)
values(3, 3, 0, 0, 1, 60, 238, 242, 39, 1, 0, 0, 0, 0, 0, 0, 0, 1384847184);
insert into mission_data (map_id, mission_id, is_talk, pic, power, exp, petexp, silver, counter, skill_lv, is_boss, crit_addon, block_addon, dodge_addon, hit_addon, ctatk_addon, kill_addon, opened_on)
values(3, 4, 0, 0, 1, 87, 239, 339, 10, 1, 1, 0, 0, 0, 0, 0, 0, 1384847184);
insert into mission_data (map_id, mission_id, is_talk, pic, power, exp, petexp, silver, counter, skill_lv, is_boss, crit_addon, block_addon, dodge_addon, hit_addon, ctatk_addon, kill_addon, opened_on)
values(3, 5, 0, 0, 1, 64, 240, 242, 39, 1, 0, 0, 0, 0, 0, 0, 0, 1384847184);
insert into mission_data (map_id, mission_id, is_talk, pic, power, exp, petexp, silver, counter, skill_lv, is_boss, crit_addon, block_addon, dodge_addon, hit_addon, ctatk_addon, kill_addon, opened_on)
values(3, 6, 0, 0, 1, 66, 241, 242, 39, 1, 0, 0, 0, 0, 0, 0, 0, 1384847184);
insert into mission_data (map_id, mission_id, is_talk, pic, power, exp, petexp, silver, counter, skill_lv, is_boss, crit_addon, block_addon, dodge_addon, hit_addon, ctatk_addon, kill_addon, opened_on)
values(3, 7, 0, 0, 1, 68, 242, 242, 39, 1, 0, 0, 0, 0, 0, 0, 0, 1384847184);
insert into mission_data (map_id, mission_id, is_talk, pic, power, exp, petexp, silver, counter, skill_lv, is_boss, crit_addon, block_addon, dodge_addon, hit_addon, ctatk_addon, kill_addon, opened_on)
values(3, 8, 0, 0, 1, 118, 243, 435, 5, 1, 1, 0, 0, 0, 0, 0, 0, 1384847184);

insert into mission_data (map_id, mission_id, is_talk, pic, power, exp, petexp, silver, counter, skill_lv, is_boss, crit_addon, block_addon, dodge_addon, hit_addon, ctatk_addon, kill_addon, opened_on)
values(4, 1, 0, 0, 1, 69, 284, 290, 39, 1, 0, 0, 0, 0, 0, 0, 0, 1384847184);
insert into mission_data (map_id, mission_id, is_talk, pic, power, exp, petexp, silver, counter, skill_lv, is_boss, crit_addon, block_addon, dodge_addon, hit_addon, ctatk_addon, kill_addon, opened_on)
values(4, 2, 0, 0, 1, 71, 285, 290, 39, 1, 0, 0, 0, 0, 0, 0, 0, 1384847184);
insert into mission_data (map_id, mission_id, is_talk, pic, power, exp, petexp, silver, counter, skill_lv, is_boss, crit_addon, block_addon, dodge_addon, hit_addon, ctatk_addon, kill_addon, opened_on)
values(4, 3, 0, 0, 1, 104, 286, 406, 10, 1, 1, 0, 0, 0, 0, 0, 0, 1384847184);
insert into mission_data (map_id, mission_id, is_talk, pic, power, exp, petexp, silver, counter, skill_lv, is_boss, crit_addon, block_addon, dodge_addon, hit_addon, ctatk_addon, kill_addon, opened_on)
values(4, 4, 0, 0, 1, 75, 287, 290, 39, 1, 0, 0, 0, 0, 0, 0, 0, 1384847184);
insert into mission_data (map_id, mission_id, is_talk, pic, power, exp, petexp, silver, counter, skill_lv, is_boss, crit_addon, block_addon, dodge_addon, hit_addon, ctatk_addon, kill_addon, opened_on)
values(4, 5, 0, 0, 1, 77, 288, 290, 39, 1, 0, 0, 0, 0, 0, 0, 0, 1384847184);
insert into mission_data (map_id, mission_id, is_talk, pic, power, exp, petexp, silver, counter, skill_lv, is_boss, crit_addon, block_addon, dodge_addon, hit_addon, ctatk_addon, kill_addon, opened_on)
values(4, 6, 0, 0, 1, 79, 289, 290, 39, 1, 0, 0, 0, 0, 0, 0, 0, 1384847184);
insert into mission_data (map_id, mission_id, is_talk, pic, power, exp, petexp, silver, counter, skill_lv, is_boss, crit_addon, block_addon, dodge_addon, hit_addon, ctatk_addon, kill_addon, opened_on)
values(4, 7, 0, 0, 1, 81, 290, 290, 39, 1, 0, 0, 0, 0, 0, 0, 0, 1384847184);
insert into mission_data (map_id, mission_id, is_talk, pic, power, exp, petexp, silver, counter, skill_lv, is_boss, crit_addon, block_addon, dodge_addon, hit_addon, ctatk_addon, kill_addon, opened_on)
values(4, 8, 0, 0, 1, 114, 291, 406, 10, 1, 1, 0, 0, 0, 0, 0, 0, 1384847184);
insert into mission_data (map_id, mission_id, is_talk, pic, power, exp, petexp, silver, counter, skill_lv, is_boss, crit_addon, block_addon, dodge_addon, hit_addon, ctatk_addon, kill_addon, opened_on)
values(4, 9, 0, 0, 1, 143, 292, 523, 5, 1, 1, 0, 0, 0, 0, 0, 0, 1384847184);


