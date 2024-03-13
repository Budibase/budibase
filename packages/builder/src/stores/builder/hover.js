import { get } from "svelte/store"
import { previewStore } from "stores/builder"
import BudiStore from "./BudiStore"

export const INITIAL_HOVER_STATE = {
  componentId: null,
}

export class HoverStore extends BudiStore {
  constructor() {
    super({ ...INITIAL_HOVER_STATE })
    this.hover = this.hover.bind(this)
  }

  hover(componentId, notifyClient = true) {
    if (componentId === get(this.store).componentId) {
      return
    }
    this.update(state => {
      state.componentId = componentId
      return state
    })
    if (notifyClient) {
      previewStore.sendEvent("hover-component", componentId)
    }
  }
}

export const hoverStore = new HoverStore()
