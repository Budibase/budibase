import { writable, get, derived } from "svelte/store"

export const createUserStore = () => {
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

  const removeUser = sessionId => {
    store.update(state => {
      return state.filter(x => x.sessionId !== sessionId)
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

export const userStore = createUserStore()

export const userSelectedResourceMap = derived(userStore, $userStore => {
  let map = {}
  $userStore.forEach(user => {
    const resource = user.builderMetadata?.selectedResourceId
    if (resource) {
      if (!map[resource]) {
        map[resource] = []
      }
      map[resource].push(user)
    }
  })
  return map
})

export const isOnlyUser = derived(userStore, $userStore => {
  return $userStore.length < 2
})
