USE game_master;

DROP TABLE IF EXISTS mission_award;
CREATE TABLE mission_award (
  mission_data_id    int(10) unsigned NOT NULL, # id in mission_data
  award_id      int(10) unsigned NOT NULL, # 奖励之道具ID
  PRIMARY KEY (mission_data_id, award_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
