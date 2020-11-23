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
    const appDefinition = await API.fetchAppDefinition(getAppId())
    config.set({
      screens: appDefinition.screens,
      page: appDefinition.page,
    })
  }

  return {
    subscribe: store.subscribe,
    actions: { fetchScreens },
  }
}

export const screenStore = createScreenStore()
