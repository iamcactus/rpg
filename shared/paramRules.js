module.exports = {
  bag: {
    'playerId': [
      {
        'rule': 'number',
        'error': 'playerId must be an int'
      }
    ],
    'type': [
      {
        'rule': 'alphaNumeric',
        'error': 'type must be names and numbers'
      }
    ]
  },
  bagSell: {
    'playerId': [
      {
        'rule': 'number',
        'error': 'playerId must be an int'
      }
    ],
    'type': [
      {
        'rule': 'alphaNumeric',
        'error': 'type must be names and numbers'
      }
    ],
    'goods': [
      {
        'rule': 'required',
        'error': 'you must set goods including name and number'
      }
    ]
  },
  battle: {
    'playerId': [
      {
        'rule': 'number',
        'error': 'playerId must be an int'
      }
    ],
    'attackeeId': [
      {
        'rule': 'number',
        'error': 'attackeeId must be an int'
      }
    ]
  },
  compo: {
    'playerId': [
      {
        'rule': 'number',
        'error': 'playerId must be an int'
      }
    ],
    'star': [
      {
        'rule': 'between',
        'args': [1, 5],
        'error': 'star must be between 1-5'
      }
    ],
    'type': [
      {
        'rule': 'alphaNumeric',
        'error': 'type must be names and numbers'
      }
    ]
  },
  decompo: {
    'playerId': [
      {
        'rule': 'number',
        'error': 'playerId must be an int'
      }
    ],
    'star': [
      {
        'rule': 'between',
        'args': [1, 5],
        'error': 'star must be between 1-5'
      }
    ],
    'type': [
      {
        'rule': 'alphaNumeric',
        'error': 'type must be names and numbers'
      }
    ],
    'data': [
      {
        'rule': 'required',
        'error': 'you must set goods including name and number'
      }
    ]
  },
  getMissionList: {
    'playerId': [
      {
        'rule': 'number',
        'error': 'playerId must be an int'
      }
    ],
    'missionDataId': [
      {
        'rule': 'number',
        'error': 'missionDataId must be an int'
      }
    ]
  },
  createPlayer: {
    'worldId': [
      {
        'rule': 'int',
        'error': 'worldId must be an int'
      }
    ],
    'cardId': [
      {
        'rule': 'int',
        'error': 'cardId must be an int'
      }
    ],
    'sexType': [
      {
        'rule': 'between',
        'args': [0, 1],
        'error': 'sexType must be between 0-1'
      }
    ],
  },
  entry: {
    'token': [
      {
        'rule': 'required',
        'error': 'You must specify a token'
      },
    ]
  },
  transmission: {
    'playerId': [
      {
        'rule': 'number',
        'error': 'playerId must be an int'
      }
    ],
    'transferId': [
      {
        'rule': 'number',
        'error': 'transferId must be an int'
      }
    ],
    'receiverId': [
      {
        'rule': 'number',
        'error': 'receiverId must be an int'
      }
    ],
    'transNum': [
      {
        'rule': 'between',
        'args': [1, 100],
        'error': 'transNum must be between 1-100'
      }
    ],
    'transType': [
      {
        'rule': 'alphaNumeric',
        'error': 'transType must be names'
      }
    ]
  },
  equipStrengthen: {
    'equipId': [
      {
        'rule': 'int',
        'error': 'equipId must be an int'
      }
    ],
    'targetLevel': [
      {
        'rule': 'between',
        'args': [1, 200],
        'error': 'targetLevel must be between 1-200'
      }
    ],
  }
};
