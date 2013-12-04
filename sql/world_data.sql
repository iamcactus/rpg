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
  KEY `on_device_id` (device_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into world_data (id, name, created_on) values(1, "启示录", 1383115317);
insert into world_data (id, name, created_on) values(2, "浣熊市行动", 1383115317);
insert into world_data (id, name, created_on) values(3, "圣女密码", 1383115317);
insert into world_data (id, name, created_on) values(4, "哈维约作战", 1383115317);
insert into world_data (id, name, created_on) values(5, "保护伞崩坏", 1383115317);
insert into world_data (id, name, created_on) values(6, "恶化", 1383115317);
insert into world_data (id, name, created_on) values(7, "诅咒", 1383115317);
commit;
