USE game_master;

#DROP TABLE IF EXISTS mission_award;
CREATE TABLE mission_award (
  mission_id    int(10) unsigned NOT NULL,
  award_id      int(10) unsigned NOT NULL, # 奖励之道具ID
  PRIMARY KEY (mission_id, award_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
