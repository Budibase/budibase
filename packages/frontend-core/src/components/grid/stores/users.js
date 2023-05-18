import { writable, get, derived } from "svelte/store"

export const createStores = () => {
  const users = writable([])

  return {
    users,
  }
}

export const deriveStores = context => {
  const { users, focusedCellId } = context

  // Generate a lookup map of cell ID to the user that has it selected, to make
  // lookups inside cells extremely fast
  const selectedCellMap = derived(
    [users, focusedCellId],
    ([$users, $focusedCellId]) => {
      let map = {}
      $users.forEach(user => {
        if (user.focusedCellId && user.focusedCellId !== $focusedCellId) {
          map[user.focusedCellId] = user
        }
      })
      return map
    }
  )

  const updateUser = user => {
    const $users = get(users)
    if (!$users.some(x => x.id === user.id)) {
      users.set([...$users, user])
    } else {
      users.update(state => {
        const index = state.findIndex(x => x.id === user.id)
        state[index] = user
        return state.slice()
      })
    }
  }

  const removeUser = user => {
    users.update(state => {
      return state.filter(x => x.id !== user.id)
    })
  }

  return {
    users: {
      ...users,
      actions: {
        updateUser,
        removeUser,
      },
    },
    selectedCellMap,
  }
}
