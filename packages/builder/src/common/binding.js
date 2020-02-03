import { isString } from "lodash/fp"

import {
  BB_STATE_BINDINGPATH,
  BB_STATE_FALLBACK,
  BB_STATE_BINDINGSOURCE,
} from "@budibase/client/src/state/isState"

export const isBinding = value =>
  !isString(value) &&
  value &&
  isString(value[BB_STATE_BINDINGPATH]) &&
  value[BB_STATE_BINDINGPATH].length > 0

export const setBinding = ({ path, fallback, source }, binding = {}) => {
  if (isNonEmptyString(path)) binding[BB_STATE_BINDINGPATH] = path
  if (isNonEmptyString(fallback)) binding[BB_STATE_FALLBACK] = fallback
  binding[BB_STATE_BINDINGSOURCE] = source || "store"
  return binding
}

export const getBinding = binding => ({
  path: binding[BB_STATE_BINDINGPATH] || "",
  fallback: binding[BB_STATE_FALLBACK] || "",
  source: binding[BB_STATE_BINDINGSOURCE] || "store",
})

const isNonEmptyString = s => isString(s) && s.length > 0
