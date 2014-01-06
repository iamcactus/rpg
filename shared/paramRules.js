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
        'rule': 'number',
        'error': 'star must be an int'
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
        'rule': 'number',
        'error': 'star must be an int'
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
        'error': 'sexType must be between 0, 1'
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
  }
};
