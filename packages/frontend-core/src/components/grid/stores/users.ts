import { writable, get, derived, Writable, Readable } from "svelte/store"
import { helpers } from "@budibase/shared-core"
import { Store as StoreContext } from "."
import { UIUser } from "@budibase/types"

interface UIEnrichedUser extends UIUser {
  color: string
  label: string
}

interface UsersStore {
  users: Writable<UIUser[]>
}

interface DerivedUsersStore {
  userCellMap: Readable<Record<string, UIUser>>
}

interface ActionUserStore {
  users: UsersStore["users"] &
    Readable<UIEnrichedUser[]> & {
      actions: {
        updateUser: (user: UIUser) => void
        removeUser: (sessionId: string) => void
      }
    }
}

export type Store = DerivedUsersStore & ActionUserStore

export const createStores = (): UsersStore => {
  const users = writable<UIUser[]>([])

  const enrichedUsers = derived(users, $users => {
    return $users.map<UIEnrichedUser>(user => ({
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

export const deriveStores = (context: StoreContext): DerivedUsersStore => {
  const { users, focusedCellId } = context

  // Generate a lookup map of cell ID to the user that has it selected, to make
  // lookups inside cells extremely fast
  const userCellMap = derived(
    [users, focusedCellId],
    ([$users, $focusedCellId]) => {
      let map: Record<string, UIUser> = {}
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
    userCellMap,
  }
}

export const createActions = (context: StoreContext): ActionUserStore => {
  const { users } = context

  const updateUser = (user: UIUser) => {
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

  const removeUser = (sessionId: string) => {
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
