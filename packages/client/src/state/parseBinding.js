export const BB_STATE_BINDINGPATH = "##bbstate"
export const BB_STATE_BINDINGSOURCE = "##bbsource"
export const BB_STATE_FALLBACK = "##bbstatefallback"

export const isBound = prop => !!parseBinding(prop)

export const parseBinding = prop => {
  if (!prop) return false
  if (isBindingExpression(prop)) {
    return parseBindingExpression(prop)
  }

  if (isAlreadyBinding(prop)) {
    return {
      path: prop.path,
      source: prop.source || "store",
      fallback: prop.fallback,
    }
  }

  if (hasBindingObject(prop)) {
    return {
      path: prop[BB_STATE_BINDINGPATH],
      fallback: prop[BB_STATE_FALLBACK] || "",
      source: prop[BB_STATE_BINDINGSOURCE] || "store",
    }
  }
}

export const isStoreBinding = binding => binding && binding.source === "store"
export const isContextBinding = binding => binding && binding.source === "context"
export const isEventBinding = binding => binding && binding.source === "event"

const hasBindingObject = prop =>
  typeof prop === "object" && prop[BB_STATE_BINDINGPATH] !== undefined

const isAlreadyBinding = prop => typeof prop === "object" && prop.path

const isBindingExpression = prop =>
  typeof prop === "string" &&
  (prop.startsWith("store.") ||
    prop.startsWith("context.") ||
    prop.startsWith("event.") ||
    prop.startsWith("route."))

const parseBindingExpression = prop => {
  let source = prop.split(".")[0]
  let path = prop.replace(`${source}.`, "")
  if (source === "route") {
    source = "store"
    path = `##routeParams.${path}`
  }
  const fallback = ""
  return {
    fallback,
    source,
    path,
  }
}
