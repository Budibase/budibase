"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = exports.eventsList = exports.events = void 0;var _fp = require("lodash/fp");

var commonPlus = function commonPlus(extra) {return (0, _fp.union)(["onBegin", "onComplete", "onError"])(extra);};

var common = function common() {return commonPlus([]);};

var _events = {
  recordApi: {
    save: commonPlus(["onInvalid", "onRecordUpdated", "onRecordCreated"]),
    "delete": common(),
    getContext: common(),
    getNew: common(),
    load: common(),
    validate: common(),
    uploadFile: common(),
    downloadFile: common() },

  indexApi: {
    buildIndex: common(),
    listItems: common(),
    "delete": common(),
    aggregates: common() },

  collectionApi: {
    getAllowedRecordTypes: common(),
    initialise: common(),
    "delete": common() },

  authApi: {
    authenticate: common(),
    authenticateTemporaryAccess: common(),
    createTemporaryAccess: common(),
    createUser: common(),
    enableUser: common(),
    disableUser: common(),
    loadAccessLevels: common(),
    getNewAccessLevel: common(),
    getNewUser: common(),
    getNewUserAuth: common(),
    getUsers: common(),
    saveAccessLevels: common(),
    isAuthorized: common(),
    changeMyPassword: common(),
    setPasswordFromTemporaryCode: common(),
    scorePassword: common(),
    isValidPassword: common(),
    validateUser: common(),
    validateAccessLevels: common(),
    setUserAccessLevels: common() },

  templateApi: {
    saveApplicationHierarchy: common(),
    saveActionsAndTriggers: common() },

  actionsApi: {
    execute: common() } };



var _eventsList = [];

var makeEvent = function makeEvent(area, method, name) {return "".concat(area, ":").concat(method, ":").concat(name);};var _loop = function _loop(

areaKey) {var _loop2 = function _loop2(
  _methodKey) {
    _events[areaKey][_methodKey] = (0, _fp.reduce)(function (obj, s) {
      obj[s] = makeEvent(areaKey, _methodKey, s);
      return obj;
    }, {})(_events[areaKey][_methodKey]);};for (var _methodKey in _events[areaKey]) {_loop2(_methodKey);
  }};for (var areaKey in _events) {_loop(areaKey);
}

for (var _areaKey in _events) {
  for (var methodKey in _events[_areaKey]) {
    for (var name in _events[_areaKey][methodKey]) {
      _eventsList.push(_events[_areaKey][methodKey][name]);
    }
  }
}

var events = _events;exports.events = events;

var eventsList = _eventsList;exports.eventsList = eventsList;var _default =

{ events: _events, eventsList: _eventsList };exports["default"] = _default;
//# sourceMappingURL=events.js.map