import api from "../api"

export const EVENT_TYPE_MEMBER_NAME = "##eventHandlerType"

export const eventHandlers = routeTo => {
  const handler = (parameters, execute) => ({
    execute,
    parameters,
  })

  return {
    "Navigate To": handler(["url"], param => routeTo(param && param.url)),
    "Create Record": handler(["url"], param => param),
    "Update Record": handler(["url"], param => param),
    "Trigger Workflow": handler(["workflow"], api.triggerWorkflow),
  }
}

export const isEventType = prop =>
  Array.isArray(prop) &&
  prop.length > 0 &&
  !prop[0][EVENT_TYPE_MEMBER_NAME] === undefined
