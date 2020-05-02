import { setState } from "./setState"
import { getState } from "./getState"
import { isArray, isUndefined } from "lodash/fp"

import { createApi } from "../api"
import { getNewChildRecordToState, getNewRecordToState } from "./coreHandlers"

export const EVENT_TYPE_MEMBER_NAME = "##eventHandlerType"

export const eventHandlers = (store, rootPath, routeTo) => {
  const handler = (parameters, execute) => ({
    execute,
    parameters,
  })

  const setStateWithStore = (path, value) => setState(store, path, value)

  let currentState
  store.subscribe(s => {
    currentState = s
  })

  const api = createApi({
    rootPath,
    setState: setStateWithStore,
    getState: (path, fallback) => getState(currentState, path, fallback),
  })

  const setStateHandler = ({ path, value }) => setState(store, path, value)

  return {
    "Set State": handler(["path", "value"], setStateHandler),
    "Load Record": handler(["recordKey", "statePath"], api.loadRecord),
    "List Records": handler(["indexKey", "statePath"], api.listRecords),
    "Save Record": handler(["statePath"], api.saveRecord),

    // "Get New Child Record": handler(
    //   ["recordKey", "collectionName", "childRecordType", "statePath"],
    //   getNewChildRecordToState(coreApi, setStateWithStore)
    // ),

    // "Get New Record": handler(
    //   ["collectionKey", "childRecordType", "statePath"],
    //   getNewRecordToState(coreApi, setStateWithStore)
    // ),

    "Navigate To": handler(["url"], param => routeTo(param && param.url)),

    Authenticate: handler(["username", "password"], api.authenticate),
  }
}

export const isEventType = prop =>
  isArray(prop) &&
  prop.length > 0 &&
  !isUndefined(prop[0][EVENT_TYPE_MEMBER_NAME])
