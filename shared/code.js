module.exports = {
	OK: 200,
  NONE_PLAYER: 201, // should create player

	FAIL: 500, 
  ERR_WRONG_PARAM: 501,
  ERR_MATERIAL_NUM: 502,

  REGIST: {
    ERR_WRONG_PARAM: 4001,
    ERR_DUPLICATED: 4002,
    ERR_EXIST: 4003,
    ERR_AUTH_FAIL: 4004,
  },

  LOGIN: {
    ERR_WRONG_PARAM: 5001,
    ERR_NOT_EXIST: 5002,
    ERR_WRONG_PASSWORD: 5003,
  },

	ENTRY: {
		FA_TOKEN_INVALID: 	1001, 
		FA_TOKEN_EXPIRE: 	1002, 
		FA_USER_NOT_EXIST: 	1003,
    FA_TOKEN_ILLEGAL: 1004,
	}, 

  FACTORY: {
    ERR_MATERIAL_NUM: 7001,
    ERR_MATERIAL_STAR: 7002,
  },
  TRANSMISSION: {
    ERR_MATERIAL: 7101,
  },

	GATE: {
		FA_NO_SERVER_AVAILABLE: 2001
	}, 

  PLAYER: {
    ERR_WRONG_NAME: 6001,
    ERR_NAME_EXIST: 6002,
    ERR_NG_NAME: 6003,
  },

  MISSION: {

  },

	CHAT: {
		FA_CHANNEL_CREATE: 		3001, 
		FA_CHANNEL_NOT_EXIST: 	3002, 
		FA_UNKNOWN_CONNECTOR: 	3003, 
		FA_USER_NOT_ONLINE: 	3004 
	}
};
