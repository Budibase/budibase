import { get } from "svelte/store"
import { previewStore } from "stores/builder"
import BudiStore from "../BudiStore"

export const INITIAL_HOVER_STATE = {
  componentId: null,
}

export class HoverStore extends BudiStore {
  hoverTimeout

  constructor() {
    super({ ...INITIAL_HOVER_STATE })
    this.hover = this.hover.bind(this)
  }

  hover(componentId, notifyClient = true) {
    clearTimeout(this.hoverTimeout)
    if (componentId) {
      this.processHover(componentId, notifyClient)
    } else {
      this.hoverTimeout = setTimeout(() => {
        this.processHover(componentId, notifyClient)
      }, 10)
    }
  }

  processHover(componentId, notifyClient) {
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
