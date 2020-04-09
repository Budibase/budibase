import { union, reduce } from "lodash/fp"

const commonPlus = extra => union(["onBegin", "onComplete", "onError"])(extra)

const common = () => commonPlus([])

const _events = {
  recordApi: {
    save: commonPlus(["onInvalid", "onRecordUpdated", "onRecordCreated"]),
    delete: common(),
    getContext: common(),
    getNew: common(),
    load: common(),
    validate: common(),
    uploadFile: common(),
    downloadFile: common(),
  },
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
    setUserAccessLevels: common(),
  },
  templateApi: {
    saveApplicationHierarchy: common(),
    saveActionsAndTriggers: common(),
  },
  actionsApi: {
    execute: common(),
  },
}

const _eventsList = []

const makeEvent = (area, method, name) => `${area}:${method}:${name}`

for (const areaKey in _events) {
  for (const methodKey in _events[areaKey]) {
    _events[areaKey][methodKey] = reduce((obj, s) => {
      obj[s] = makeEvent(areaKey, methodKey, s)
      return obj
    }, {})(_events[areaKey][methodKey])
  }
}

for (const areaKey in _events) {
  for (const methodKey in _events[areaKey]) {
    for (const name in _events[areaKey][methodKey]) {
      _eventsList.push(_events[areaKey][methodKey][name])
    }
  }
}

export const events = _events

export const eventsList = _eventsList

export default { events: _events, eventsList: _eventsList }
