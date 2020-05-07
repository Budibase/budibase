import { eventHandlers } from "../../../../client/src/state/eventHandlers"
import { writable } from "svelte/store"
export { EVENT_TYPE_MEMBER_NAME } from "../../../../client/src/state/eventHandlers"

export const allHandlers = user => {
  const store = writable({
    _bbuser: user,
  })

  const handlersObj = eventHandlers(store)

  const handlers = Object.keys(handlersObj).map(name => ({
    name,
    ...handlersObj[name],
  }))

  return handlers
}
