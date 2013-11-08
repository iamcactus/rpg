USE game_user;
CREATE TABLE chat_data (
  user_id     int(10) unsigned NOT NULL,
  msg         varchar(16),
  created_on  int(10) unsigned NOT NULL,
  KEY `on_user_id` (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
