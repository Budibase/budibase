import { writable, get } from "svelte/store"

export const createUploadStore = () => {
  const store = writable([])

  // Registers a new file upload component
  const registerFileUpload = (componentId, callback) => {
    if (!componentId || !callback) {
      return
    }

    store.update(state => {
      state.push({
        componentId,
        callback,
      })
      return state
    })
  }

  // Unregisters a file upload component
  const unregisterFileUpload = componentId => {
    store.update(state => state.filter(c => c.componentId !== componentId))
  }

  // Processes a file upload for a given component ID
  const processFileUpload = async componentId => {
    if (!componentId) {
      return
    }

    const component = get(store).find(c => c.componentId === componentId)
    return await component?.callback()
  }

  return {
    subscribe: store.subscribe,
    actions: { registerFileUpload, unregisterFileUpload, processFileUpload },
  }
}

export const uploadStore = createUploadStore()
