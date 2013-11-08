USE game_master;
Drop table if exists world_data;
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

