export const BB_STATE_BINDINGPATH = "##bbstate"
export const BB_STATE_BINDINGSOURCE = "##bbsource"
export const BB_STATE_FALLBACK = "##bbstatefallback"

export const isBound = prop =>
  prop !== undefined && prop[BB_STATE_BINDINGPATH] !== undefined

export const takeStateFromStore = prop =>
  prop[BB_STATE_BINDINGSOURCE] === undefined ||
  prop[BB_STATE_BINDINGSOURCE] === "store"

export const takeStateFromContext = prop =>
  prop[BB_STATE_BINDINGSOURCE] === "context"

export const takeStateFromEventParameters = prop =>
  prop[BB_STATE_BINDINGSOURCE] === "event"
