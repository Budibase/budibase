import { writable, derived } from "svelte/store"
import { routeStore } from "./routes"
import * as API from "../api"
import { getAppId } from "../utils"

const createScreenStore = () => {
  const config = writable({
    screens: [],
    page: {},
  })
  const store = derived([config, routeStore], ([$config, $routeStore]) => {
    const { screens, page } = $config
    const activeScreen =
      screens.length === 1
        ? screens[0]
        : screens.find(
            screen => screen.routing.route === $routeStore.activeRoute
          )
    return {
      screens,
      page,
      activeScreen,
    }
  })

  const fetchScreens = async () => {
    let screens
    let page
    const inBuilder = !!window["##BUDIBASE_IN_BUILDER##"]
    if (inBuilder) {
      // Load screen and page from the window object if in the builder
      screens = [window["##BUDIBASE_PREVIEW_SCREEN##"]]
      page = window["##BUDIBASE_PREVIEW_PAGE##"]
    } else {
      // Otherwise load from API
      const appDefinition = await API.fetchAppDefinition(getAppId())
      screens = appDefinition.screens
      page = appDefinition.page
    }
    config.set({ screens, page })
  }

  return {
    subscribe: store.subscribe,
    actions: { fetchScreens },
  }
}

export const screenStore = createScreenStore()
