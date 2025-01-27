import { get } from "svelte/store"
import { BudiStore } from "../BudiStore"
import { previewStore } from "@/stores/builder"

interface BuilderHoverStore {
  hoverTimeout?: NodeJS.Timeout
  componentId: string | null
}

export const INITIAL_HOVER_STATE = {
  componentId: null,
}

export class HoverStore extends BudiStore<BuilderHoverStore> {
  hoverTimeout?: NodeJS.Timeout

  constructor() {
    super({ ...INITIAL_HOVER_STATE })
    this.hover = this.hover.bind(this)
  }

  hover(componentId: string, notifyClient = true) {
    clearTimeout(this.hoverTimeout)
    if (componentId) {
      this.processHover(componentId, notifyClient)
    } else {
      this.hoverTimeout = setTimeout(() => {
        this.processHover(componentId, notifyClient)
      }, 10)
    }
  }

  processHover(componentId: string, notifyClient?: boolean) {
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
