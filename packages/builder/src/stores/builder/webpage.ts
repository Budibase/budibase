import { Helpers } from "@budibase/bbui"
import { BudiStore } from "../BudiStore"
import { derived, get } from "svelte/store"
import { screenStore } from "./screens"

interface Webpage {
  _id: string
  name: string
}

interface WebpageState {
  selected?: Webpage
  items: Webpage[]
}

class WebpageStore extends BudiStore<WebpageState> {
  constructor() {
    super({
      items: [{ name: "Default app", _id: "app_default" }],
      selected: { name: "Default app", _id: "app_default" },
    })
  }

  add() {
    const id = `app_${Helpers.uuid()}`
    this.store.update(state => {
      const count = state.items.length + 1

      const newApp = { name: `New app ${count}`, _id: id }
      return {
        ...state,
        items: [...state.items, newApp],
        selected: newApp,
      }
    })
    return id
  }

  async select(appId: string) {
    this.store.update(state => {
      const app = state.items.find(i => i._id === appId)
      return {
        ...state,
        selected: app,
      }
    })

    const screens = get(screenStore).screens.filter(s => s.webpage === appId)

    return screens[0]?._id
  }
}

export const webpageStore = new WebpageStore()

export const selectedWebpage = derived(webpageStore, $webpageStore => {
  return $webpageStore.selected!
})
