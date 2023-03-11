import { writable, get, derived } from "svelte/store"

export const createUserStores = () => {
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
          // Enrich users with colors
          .map((user, idx) => {
            // Generate random colour hue
            let hue = 1
            for (let i = 0; i < user.email.length && i < 5; i++) {
              hue *= user.email.charCodeAt(i)
            }
            hue = hue % 360
            const color =
              idx === 0
                ? "var(--spectrum-global-color-blue-400)"
                : `hsl(${hue}, 50%, 40%)`

            // Generate friendly label
            let label = user.email
            if (user.firstName) {
              label = user.firstName
              if (user.lastName) {
                label += ` ${user.lastName}`
              }
            }

            return {
              ...user,
              color,
              label,
            }
          })
      )
    },
    []
  )

  // Generate a lookup map of cell ID to the user that has it selected, to make
  // lookups inside sheet cells extremely fast
  const selectedCellMap = derived(
    [enrichedUsers, userId],
    ([$enrichedUsers, $userId]) => {
      let map = {}
      $enrichedUsers.forEach(user => {
        if (user.selectedCellId && user.id !== $userId) {
          map[user.selectedCellId] = user
        }
      })
      return map
    },
    {}
  )

  const updateUser = user => {
    const $users = get(users)
    const index = $users.findIndex(x => x.id === user.id)
    if (index === -1) {
      users.set([...$users, user])
    } else {
      users.update(state => {
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
      ...enrichedUsers,
      set: users.set,
      update: users.update,
      actions: {
        updateUser,
        removeUser,
      },
    },
    selectedCellMap,
    userId,
  }
}
