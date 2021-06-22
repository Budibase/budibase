import * as API from "../api"
import { writable, get } from "svelte/store"
import { builderStore } from "./builder"
import { TableNames } from "../constants"

const createAuthStore = () => {
  const store = writable(null)

  // Fetches the user object if someone is logged in and has reloaded the page
  const fetchUser = async () => {
    // Fetch the first user if inside the builder
    if (get(builderStore).inBuilder) {
      const users = await API.fetchTableData(TableNames.USERS)
      if (!users.error && users[0] != null) {
        store.set(users[0])
      }
    }

    // Or fetch the current user from localstorage in a real app
    else {
      const user = await API.fetchSelf()
      store.set(user)
    }
  }

  return {
    subscribe: store.subscribe,
    actions: { fetchUser },
  }
}

export const authStore = createAuthStore()
