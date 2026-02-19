import { auth } from "@/stores/portal"
import { derived } from "svelte/store"
import { DerivedBudiStore } from "../BudiStore"

interface AIStateStore {}

interface AIDerivedStore {
  aiEnabled: boolean
}

class AIStore extends DerivedBudiStore<AIStateStore, AIDerivedStore> {
  constructor() {
    const makeDerivedStore = () => {
      return derived([auth], ([$auth]): AIDerivedStore => {
        return { aiEnabled: !!$auth.user?.llm }
      })
    }

    super({}, makeDerivedStore)
  }
}

export const aiStore = new AIStore()
