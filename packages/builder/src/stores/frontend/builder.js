import { writable } from "svelte/store"
import { createBuilderWebsocket } from "./websocket.js"
import { BuilderSocketEvent } from "@budibase/shared-core"
import BudiStore from "./BudiStore"
import { TOUR_KEYS } from "components/portal/onboarding/tours.js"

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
    this.update(state => ({
      ...state,
      previousTopNavPath: {
        ...(state.previousTopNavPath || {}),
        [route]: url,
      },
    }))
  }

  selectResource(id) {
    this.websocket.emit(BuilderSocketEvent.SelectResource, {
      resourceId: id,
    })
  }

  registerTourNode(tourStepKey, node) {
    this.update(state => {
      const update = {
        ...state,
        tourNodes: {
          ...state.tourNodes,
          [tourStepKey]: node,
        },
      }
      return update
    })
  }

  destroyTourNode(tourStepKey) {
    if (this.tourNodes[tourStepKey]) {
      this.update(state => ({
        ...state,
        tourNodes: {
          [tourStepKey]: _,
          ...this.tourNodes,
        },
      }))
    }
  }

  startBuilderOnboarding() {
    this.update(state => ({
      ...state,
      onboarding: true,
      tourKey: TOUR_KEYS.TOUR_BUILDER_ONBOARDING,
    }))
  }

  startTour(tourKey) {
    this.update(state => ({
      ...state,
      tourKey: tourKey,
    }))
  }
}

export const builderStore = new BuilderStore()

export const screensHeight = writable("210px")
