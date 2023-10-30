import { writable } from "svelte/store"
import { createBuilderWebsocket } from "./websocket.js"
import { BuilderSocketEvent } from "@budibase/shared-core"
import BudiStore from "./BudiStore"

export const INITIAL_BUILDER_STATE = {
  previousTopNavPath: {},
  highlightedSettingKey: null,
  propertyFocus: null,
  builderSidePanel: false,
  onboarding: false,
  tourNodes: null,
  tourKey: null,
  tourStepKey: null,
}

export class BuilderStore extends BudiStore {
  constructor() {
    super({ ...INITIAL_BUILDER_STATE })
    this.websocket
  }

  init(app) {
    if (!app?.appId) {
      console.error("BuilderStore: No appId supplied for websocket")
      return
    }
    if (!this.websocket) {
      this.websocket = createBuilderWebsocket(app.appId)
    }
  }

  refresh() {
    this.store.set(this.store.get())
  }

  reset() {
    this.store.set({ ...INITIAL_BUILDER_STATE })
    this.websocket?.disconnect()
    this.websocket = null
  }

  highlightSetting(key) {
    this.update(state => ({
      ...state,
      highlightedSettingKey: key,
    }))
  }

  propertyFocus(key) {
    this.update(state => ({
      ...state,
      propertyFocus: key,
    }))
  }

  showBuilderSidePanel() {
    this.update(state => ({
      ...state,
      builderSidePanel: true,
    }))
  }

  hideBuilderSidePanel() {
    this.update(state => ({
      ...state,
      builderSidePanel: false,
    }))
  }

  setPreviousTopNavPath(route, url) {
    this.update(state => {
      if (!state.previousTopNavPath) state.previousTopNavPath = {}
      state.previousTopNavPath[route] = url
      return state
    })
  }

  selectResource(id) {
    this.websocket.emit(BuilderSocketEvent.SelectResource, {
      resourceId: id,
    })
  }

  /*
  register
    update(state => {
      const update = {
        ...state,
        tourNodes: {
          ...state.tourNodes,
          [tourStepKey]: node,
        },
      }
      return update
    })
  */
}

export const builderStore = new BuilderStore()

export const screensHeight = writable("210px")
