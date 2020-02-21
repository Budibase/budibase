import { isString } from "lodash/fp"

import {
  BB_STATE_BINDINGPATH,
  BB_STATE_FALLBACK,
  BB_STATE_BINDINGSOURCE,
  isBound,
  parseBinding,
} from "@budibase/client/src/state/parseBinding"

export const isBinding = isBound

export const setBinding = ({ path, fallback, source }, binding = {}) => {
  if (isNonEmptyString(path)) binding[BB_STATE_BINDINGPATH] = path
  if (isNonEmptyString(fallback)) binding[BB_STATE_FALLBACK] = fallback
  binding[BB_STATE_BINDINGSOURCE] = source || "store"
  return binding
}

export const getBinding = parseBinding

const isNonEmptyString = s => isString(s) && s.length > 0
