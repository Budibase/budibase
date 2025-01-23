import { get } from "svelte/store"
import { BudiStore, PersistenceType } from "../BudiStore"

type TemporalItem = Record<string, any> & { expiry: number }
type TemporalState = Record<string, TemporalItem>

class TemporalStore extends BudiStore<TemporalState> {
  constructor() {
    super(
      {},
      {
        persistence: {
          key: "bb-temporal",
          type: PersistenceType.LOCAL,
        },
      }
    )
  }

  setExpiring = (
    key: string,
    data: Record<string, any>,
    durationSeconds: number
  ) => {
    const updated: TemporalItem = {
      ...data,
      expiry: Date.now() + durationSeconds * 1000,
    }
    this.update(state => ({
      ...state,
      [key]: updated,
    }))
  }

  getExpiring(key: string) {
    const entry = get(this.store)[key]
    if (!entry) {
      return null
    }
    const currentExpiry = entry.expiry
    if (currentExpiry < Date.now()) {
      this.update(state => {
        delete state[key]
        return state
      })
      return null
    } else {
      return entry
    }
  }
}

export const temporalStore = new TemporalStore()
