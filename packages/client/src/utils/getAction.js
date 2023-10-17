import { get } from "svelte/store"
import { getContext } from "svelte"

/**
 * Gets a component action.
 * @param id The component ID that provides the action
 * @param type The action type to get
 * @returns {null|*} The action function
 */
export const getAction = (id, type) => {
  if (!id || !type) {
    return null
  }
  const context = getContext("context")
  if (!context) {
    return null
  }
  return get(context)?.[`${id}_${type}`]
}
