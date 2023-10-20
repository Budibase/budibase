import { writable, get, derived } from "svelte/store"
import { helpers } from "@budibase/shared-core"

export const createStores = () => {
  const users = writable([])

  const enrichedUsers = derived(users, $users => {
    return $users.map(user => ({
      ...user,
      color: helpers.getUserColor(user),
      label: helpers.getUserLabel(user),
    }))
  })

  return {
    users: {
      ...users,
      subscribe: enrichedUsers.subscribe,
    },
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
        const cellId = user.gridMetadata?.focusedCellId
        if (cellId && cellId !== $focusedCellId) {
          map[cellId] = user
        }
      })
      return map
    }
  )

  return {
    selectedCellMap,
  }
}

export const createActions = context => {
  const { users } = context

  const updateUser = user => {
    const $users = get(users)
    if (!$users.some(x => x.sessionId === user.sessionId)) {
      users.set([...$users, user])
    } else {
      users.update(state => {
        const index = state.findIndex(x => x.sessionId === user.sessionId)
        state[index] = user
        return state.slice()
      })
    }
  }

  const removeUser = sessionId => {
    users.update(state => {
      return state.filter(x => x.sessionId !== sessionId)
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
  }
}
