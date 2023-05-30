import { writable, get } from "svelte/store"

export const getUserStore = () => {
  const store = writable([])

  const init = users => {
    store.set(users)
  }

  const updateUser = user => {
    const $users = get(store)
    if (!$users.some(x => x.sessionId === user.sessionId)) {
      store.set([...$users, user])
    } else {
      store.update(state => {
        const index = state.findIndex(x => x.sessionId === user.sessionId)
        state[index] = user
        return state.slice()
      })
    }
  }

  const removeUser = user => {
    store.update(state => {
      return state.filter(x => x.sessionId !== user.sessionId)
    })
  }

  const reset = () => {
    store.set([])
  }

  return {
    ...store,
    actions: {
      init,
      updateUser,
      removeUser,
      reset,
    },
  }
}
