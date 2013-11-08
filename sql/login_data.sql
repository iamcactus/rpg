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
