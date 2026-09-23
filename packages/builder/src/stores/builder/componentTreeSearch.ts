import { BudiStore } from "@/stores/BudiStore"

interface ComponentTreeSearchState {
  clearSearchSequence: number
}

class ComponentTreeSearchStore extends BudiStore<ComponentTreeSearchState> {
  constructor() {
    super({ clearSearchSequence: 0 })
  }

  clearSearch() {
    this.update(state => {
      state.clearSearchSequence += 1
      return state
    })
  }
}

export const componentTreeSearchStore = new ComponentTreeSearchStore()
