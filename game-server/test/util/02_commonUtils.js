var should = require('should');
var commonUtils = require('../../../shared/util/commonUtils');
var PARAMRULES = require('../../../shared/paramRules');

var entryKey = 'entry';
var entryParamOk = {
  token: 'aaaaaaaaaaa111111'
};
var entryParamEmpty = {
  token: ''
};
var entryParamNone = {
};

describe('entryParam test', function() {
  it('should return true when token is set', function() {
    var resOk = commonUtils.validate(entryKey, entryParamOk);
    resOk.should.equal(true);
  });
  it('should return false when no token', function() {
    var resNone = commonUtils.validate(entryKey, entryParamNone);
    resNone.should.equal(false);
  });
  it('should return false when token is empty', function() {
    var resEmpty = commonUtils.validate(entryKey, entryParamEmpty);
    resEmpty.should.equal(false);
  });
});

var getMissionListKey = 'getMissionList';
var getMissionListParamOk = {
  playerId: 10026,
  mapDataId: 1
};
/*
// JavaScirpt takes empty string as 0 in the context of NUMBER,
// so there must be additional check in the users' sides
// pass follows
var getMissionListParamEmpty = {
  playerId: '',
  mapId: ''
};
*/

var getMissionListParamNone = {
};

describe('getMissionListParam test', function() {
  it('should return true when param is set', function() {
    var resOk = commonUtils.validate(getMissionListKey, getMissionListParamOk);
    resOk.should.equal(true);
  });
  it('should return false when no param', function() {
    var resNone = commonUtils.validate(getMissionListKey, getMissionListParamNone);
    resNone.should.equal(false);
  });
  /*
  it('should return false when param is empty', function() {
    var resEmpty = commonUtils.validate(getMissionListKey, getMissionListParamEmpty);
    resEmpty.should.equal(false);
  });
  */
});
