import { writable, get } from "svelte/store"

export const getUserStore = () => {
  const store = writable([])

  const init = users => {
    store.set(users)
  }

  const updateUser = user => {
    console.log(user)
    const $users = get(store)
    if (!$users.some(x => x.id === user.id)) {
      store.set([...$users, user])
    } else {
      store.update(state => {
        const index = state.findIndex(x => x.id === user.id)
        state[index] = user
        return state.slice()
      })
    }
  }

  const removeUser = user => {
    store.update(state => {
      return state.filter(x => x.id !== user.id)
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
