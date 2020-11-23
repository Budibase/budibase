import { writable, get } from "svelte/store"
import { enrichDataBinding } from "../utils"
import { cloneDeep } from "lodash/fp"

const initialValue = {
  data: null,
}

export const createDataContextStore = existingContext => {
  const initial = existingContext ? cloneDeep(existingContext) : initialValue
  const store = writable(initial)

  // Adds a context layer to the data context tree
  const addContext = (row, componentId) => {
    store.update(state => {
      if (row && componentId) {
        state[componentId] = row
        state.data = row
      }
      return state
    })
  }

  // Enriches props by running mustache and filling in any data bindings present
  // in the prop values
  const enrichDataBindings = props => {
    const state = get(store)
    let enrichedProps = {}
    Object.entries(props).forEach(([key, value]) => {
      enrichedProps[key] = enrichDataBinding(value, state)
    })
    return enrichedProps
  }

  return {
    subscribe: store.subscribe,
    actions: { addContext, enrichDataBindings },
  }
}
