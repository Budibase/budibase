import { API } from "api"
import { writable } from "svelte/store"

const createRoleStore = () => {
  const store = writable([])

  // Fetches the user object if someone is logged in and has reloaded the page
  const fetchAccessibleRoles = async () => {
    const accessible = await API.getAccessibleRoles()
    // Use the app self if present, otherwise fallback to the global self
    store.set(accessible || [])
  }

  return {
    subscribe: store.subscribe,
    actions: { fetchAccessibleRoles },
  }
}

export const roleStore = createRoleStore()
