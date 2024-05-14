import { get } from "svelte/store"
import { createBuilderWebsocket } from "./websocket.js"
import { BuilderSocketEvent } from "@budibase/shared-core"
import BudiStore from "../BudiStore.js"
import { TOUR_KEYS } from "components/portal/onboarding/tours.js"

export const INITIAL_BUILDER_STATE = {
  previousTopNavPath: {},
  highlightedSetting: null,
  propertyFocus: null,
  builderSidePanel: false,
  onboarding: false,
  tourNodes: null,
  tourKey: null,
  tourStepKey: null,
  hoveredComponentId: null,
  fonts: null,
}

export class BuilderStore extends BudiStore {
  constructor() {
    super({ ...INITIAL_BUILDER_STATE })

    this.init = this.init.bind(this)
    this.refresh = this.refresh.bind(this)
    this.reset = this.reset.bind(this)
    this.highlightSetting = this.highlightSetting.bind(this)
    this.propertyFocus = this.propertyFocus.bind(this)
    this.hideBuilderSidePanel = this.hideBuilderSidePanel.bind(this)
    this.showBuilderSidePanel = this.showBuilderSidePanel.bind(this)
    this.setPreviousTopNavPath = this.setPreviousTopNavPath.bind(this)
    this.selectResource = this.selectResource.bind(this)
    this.registerTourNode = this.registerTourNode.bind(this)
    this.destroyTourNode = this.destroyTourNode.bind(this)
    this.startBuilderOnboarding = this.startBuilderOnboarding.bind(this)

    this.websocket
  }

  loadFonts(fontFaces) {
    const ff = fontFaces.map(
      fontFace => `${fontFace.family}-${fontFace.weight}`
    )
    this.update(state => ({
      ...state,
      fonts: [...(state.fonts || []), ...ff],
    }))
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

  highlightSetting(key, type) {
    this.update(state => ({
      ...state,
      highlightedSetting: key ? { key, type: type || "info" } : null,
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
    const store = get(this.store)
    if (store.tourNodes?.[tourStepKey]) {
      const nodes = { ...store.tourNodes }
      delete nodes[tourStepKey]
      this.update(state => ({
        ...state,
        tourNodes: nodes,
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

  endBuilderOnboarding() {
    this.update(state => ({
      ...state,
      onboarding: false,
    }))
  }

  setTour(tourKey) {
    this.update(state => ({
      ...state,
      tourStepKey: null,
      tourNodes: null,
      tourKey: tourKey,
    }))
  }
}

export const builderStore = new BuilderStore()
