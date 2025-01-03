import { get, derived } from "svelte/store"
import { BudiStore } from "../BudiStore"
import { UIUser } from "@budibase/types"

export class UserStore extends BudiStore<UIUser[]> {
  constructor() {
    super([])
  }

  init(users: UIUser[]) {
    this.set(users)
  }

  updateUser(user: UIUser) {
    const $users = get(this)
    if (!$users.some(x => x.sessionId === user.sessionId)) {
      this.set([...$users, user])
    } else {
      this.update(state => {
        const index = state.findIndex(x => x.sessionId === user.sessionId)
        state[index] = user
        return state.slice()
      })
    }
  }

  removeUser(sessionId: string) {
    this.update(state => {
      return state.filter(x => x.sessionId !== sessionId)
    })
  }

  reset() {
    this.set([])
  }
}

export const userStore = new UserStore()

export const userSelectedResourceMap = derived(
  userStore,
  ($userStore): Record<string, UIUser[]> => {
    let map: Record<string, UIUser[]> = {}
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
  }
)

export const isOnlyUser = derived(userStore, $userStore => {
  return $userStore.length < 2
})
