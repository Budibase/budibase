// import { isUndefined, isObject } from "lodash/fp"
import getOr from "lodash/fp/getOr";
// import { parseBinding, isStoreBinding } from "./parseBinding"

export const getState = (state, path, fallback) => {
  if (!state) return fallback
  if (!path || path.length === 0) return fallback

  return getOr(fallback, path, state);

  // if (path === "$") return state

  // const pathParts = path.split(".")
  // const safeGetPath = (obj, currentPartIndex = 0) => {
  //   const currentKey = pathParts[currentPartIndex]

  //   if (pathParts.length - 1 == currentPartIndex) {
  //     const value = obj[currentKey]
  //     if (isUndefined(value)) return fallback
  //     else return value
  //   }

  //   if (
  //     obj[currentKey] === null ||
  //     obj[currentKey] === undefined ||
  //     !isObject(obj[currentKey])
  //   ) {
  //     return fallback
  //   }

  //   return safeGetPath(obj[currentKey], currentPartIndex + 1)
  // }

  // return safeGetPath(state)
}

// export const getStateOrValue = (globalState, prop, currentContext) => {
//   if (!prop) return prop

//   const binding = parseBinding(prop)

//   if (binding) {
//     const stateToUse = isStoreBinding(binding) ? globalState : currentContext

//     return getState(stateToUse, binding.path, binding.fallback)
//   }

//   return prop
// }
