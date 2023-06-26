import { writable } from "svelte/store"

export const createConfigStore = (integration, config) => {
  const configStore = writable(config)

  const updateFieldValue = (key, value) => {
    configStore.update($configStore => {
      const newStore = { ...$configStore }

      if (integration.datasource[key].type === "fieldGroup") {
        value.forEach(field => {
          newStore[field.key] = field.value
        })
      } else {
        newStore[key] = value
      }

      return newStore
    })
  }

  return {
    subscribe: configStore.subscribe,
    updateFieldValue,
  }
}
