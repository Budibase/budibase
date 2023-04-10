import { writable, get } from "svelte/store"

export const createValidationStores = () => {
  const validation = writable({})

  return {
    validation: {
      subscribe: validation.subscribe,
      actions: {
        setError: (cellId, error) => {
          if (!cellId) {
            return
          }
          validation.update(state => ({
            ...state,
            [cellId]: error,
          }))
        },
        getError: cellId => {
          return get(validation)[cellId]
        },
      },
    },
  }
}
