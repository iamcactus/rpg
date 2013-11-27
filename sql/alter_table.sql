use game_world_1001;
#alter table player_param add vip_level   tinyint(3) unsigned NOT NULL DEFAULT 0 COMMENT '当前VIP等级' after player_id;
alter table player_param add mission_data_id int(10) unsigned NOT NULL DEFAULT 1 COMMENT '当前关卡ID' after level;
alter table player_param add gold        int(10) unsigned NOT NULL DEFAULT 0 COMMENT '元宝' after mission_data_id;
alter table player_param add silver      int(10) unsigned NOT NULL DEFAULT 0 COMMENT '银两' after gold;

