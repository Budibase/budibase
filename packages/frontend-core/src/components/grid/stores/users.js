import { writable, get, derived } from "svelte/store"

export const createStores = () => {
  const users = writable([])
  const userId = writable(null)

  // Enrich users with unique colours
  const enrichedUsers = derived(
    [users, userId],
    ([$users, $userId]) => {
      return (
        $users
          .slice()
          // Place current user first
          .sort((a, b) => {
            if (a.id === $userId) {
              return -1
            } else if (b.id === $userId) {
              return 1
            } else {
              return 0
            }
          })
      )
    },
    []
  )

  return {
    users: {
      ...users,
      subscribe: enrichedUsers.subscribe,
    },
    userId,
  }
}

export const deriveStores = context => {
  const { users, userId } = context

  // Generate a lookup map of cell ID to the user that has it selected, to make
  // lookups inside cells extremely fast
  const selectedCellMap = derived(
    [users, userId],
    ([$enrichedUsers, $userId]) => {
      let map = {}
      $enrichedUsers.forEach(user => {
        if (user.focusedCellId && user.id !== $userId) {
          map[user.focusedCellId] = user
        }
      })
      return map
    },
    {}
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
