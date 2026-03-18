import { aiConfigsStore, licensing } from "@/stores/portal"
import { derived } from "svelte/store"
import { DerivedBudiStore } from "../BudiStore"
import { BUDIBASE_AI_PROVIDER_ID } from "@budibase/types"

interface AIStateStore {}

interface AIDerivedStore {
  aiEnabled: boolean
  bbaiCreditsExceeded: boolean
}

class AIStore extends DerivedBudiStore<AIStateStore, AIDerivedStore> {
  constructor() {
    const makeDerivedStore = () => {
      return derived(
        [aiConfigsStore, licensing],
        ([$aiConfigsStore, $licensing]): AIDerivedStore => {
          const defaultConfig =
            $aiConfigsStore.customConfigsPerType.completions.find(
              c => c.isDefault
            )
          const bbaiCreditsExceeded =
            defaultConfig?.provider === BUDIBASE_AI_PROVIDER_ID &&
            $licensing.aiCreditsExceeded

          return {
            aiEnabled: !!defaultConfig && !bbaiCreditsExceeded,
            bbaiCreditsExceeded,
          }
        }
      )
    }

    super({}, makeDerivedStore)
  }
}

export const aiStore = new AIStore()
