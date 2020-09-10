export const EVENT_TYPE_MEMBER_NAME = "##eventHandlerType"

export const eventHandlers = routeTo => {
  const handler = (parameters, execute) => ({
    execute,
    parameters,
  })

  return {
    "Navigate To": handler(["url"], param => routeTo(param && param.url)),
  }
}

export const isEventType = prop =>
  Array.isArray(prop) &&
  prop.length > 0 &&
  !prop[0][EVENT_TYPE_MEMBER_NAME] === undefined
