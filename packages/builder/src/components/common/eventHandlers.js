import { eventHandlers } from "../../../../client/src/state/eventHandlers"
import { writable } from "svelte/store"
export { EVENT_TYPE_MEMBER_NAME } from "../../../../client/src/state/eventHandlers"
import { createCoreApi } from "../../../../client/src/core"

export const allHandlers = (appDefinition, user) => {
  const coreApi = createCoreApi(appDefinition, user)
  appDefinition.hierarchy = coreApi.templateApi.constructHierarchy(
    appDefinition.hierarchy
  )
  const store = writable({
    _bbuser: user,
  })

  const handlersObj = eventHandlers(store, coreApi)
  const handlersArray = []
  for (let key in handlersObj) {
    handlersArray.push({ name: key, ...handlersObj[key] })
  }
  return handlersArray
}
