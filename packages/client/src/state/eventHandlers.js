import api from "../api"
import renderTemplateString from "./renderTemplateString"

export const EVENT_TYPE_MEMBER_NAME = "##eventHandlerType"

export const eventHandlers = routeTo => {
  const handlers = {
    "Navigate To": param => routeTo(param && param.url),
    "Create Record": api.createRecord,
    "Update Record": api.updateRecord,
    "Trigger Workflow": api.triggerWorkflow,
  }

  // when an event is called, this is what gets run
  const runEventActions = async (actions, state) => {
    if (!actions) return
    for (let action of actions) {
      const handler = handlers[action[EVENT_TYPE_MEMBER_NAME]]
      const parameters = createParameters(action.parameters, state)
      if (handler) {
        await handler(parameters)
      }
    }
  }

  return runEventActions
}

const createParameters = (parameterTemplateObj, state) => {
  const parameters = {}
  for (let key in parameterTemplateObj) {
    if (typeof parameterTemplateObj[key] === "string") {
      parameters[key] = renderTemplateString(parameterTemplateObj[key], state)
    } else if (typeof parameterTemplateObj[key] === "object") {
      parameters[key] = createParameters(parameterTemplateObj[key], state)
    }
  }
  return parameters
}
