import { auth, licensing } from "@/stores/portal"
import { derived } from "svelte/store"
import { DerivedBudiStore } from "../BudiStore"

interface AIStateStore {}

interface AIDerivedStore {
  aiEnabled: boolean
  bbaiCreditsExceeded: boolean
}

class AIStore extends DerivedBudiStore<AIStateStore, AIDerivedStore> {
  constructor() {
    const makeDerivedStore = () => {
      return derived(
        [auth, licensing],
        ([$auth, $licensing]): AIDerivedStore => {
          const bbaiCreditsExceeded =
            $auth.user?.llm?.provider === "BudibaseAI" &&
            $licensing.aiCreditsExceeded

          return {
            aiEnabled: !!$auth.user?.llm && !bbaiCreditsExceeded,
            bbaiCreditsExceeded,
          }
        }
      )
    }

    super({}, makeDerivedStore)
  }
}

export const aiStore = new AIStore()
