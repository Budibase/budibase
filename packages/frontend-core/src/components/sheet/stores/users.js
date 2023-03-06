import { writable, get, derived } from "svelte/store"

export const createUserStores = () => {
  const users = writable([])
  const userId = writable(null)

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

  const selectedCellMap = derived([users, userId], ([$users, $userId]) => {
    let map = {}
    $users.forEach(user => {
      if (user.selectedCellId && user.id !== $userId) {
        map[user.selectedCellId] = user
      }
    })
    console.log(map)
    return map
  })

  return {
    users: {
      ...users,
      actions: {
        updateUser,
      },
    },
    selectedCellMap,
    userId,
  }
}
