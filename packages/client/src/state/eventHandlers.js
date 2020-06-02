import { setState } from "./setState"
import { getState } from "./getState"
import { isArray, isUndefined } from "lodash/fp"

import { createApi } from "../api"

export const EVENT_TYPE_MEMBER_NAME = "##eventHandlerType"

export const eventHandlers = (rootPath, routeTo) => {
  const handler = (parameters, execute) => ({
    execute,
    parameters,
  })

  const api = createApi({
    rootPath,
    setState,
    getState: (path, fallback) => getState(path, fallback),
  })

  const setStateHandler = ({ path, value }) => setState(path, value)

  return {
    "Set State": handler(["path", "value"], setStateHandler),
    "Navigate To": handler(["url"], param => routeTo(param && param.url)),
    "Trigger Workflow": handler(["workflow"], api.triggerWorkflow),
  }
}

export const isEventType = prop =>
  isArray(prop) &&
  prop.length > 0 &&
  !isUndefined(prop[0][EVENT_TYPE_MEMBER_NAME])
