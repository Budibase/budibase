import { eventHandlers } from "../../../../client/src/state/eventHandlers"
export { EVENT_TYPE_MEMBER_NAME } from "../../../../client/src/state/eventHandlers"

export const allHandlers = () => {
  const handlersObj = eventHandlers()

  const handlers = Object.keys(handlersObj).map(name => ({
    name,
    ...handlersObj[name],
  }))

  return handlers
}
