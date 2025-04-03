import { Helpers } from "@budibase/bbui"
import { BudiStore } from "../BudiStore"
import { appStore } from "./app"

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
    super({ items: [] })

    appStore.subscribe($appStore => {
      const item = localStorage.getItem(this.getKey($appStore.appId))
      if (!item) {
        const app = { name: "Default app", _id: "app_default" }
        this.store.update(state => ({
          ...state,
          items: [app],
          selected: app,
        }))
      }
    })
  }

  private getKey(id: string) {
    return `bb_webpage_${id}`
  }

  add() {
    this.store.update(state => {
      const count = state.items.length + 1
      const id = `app_${Helpers.uuid()}`

      const newApp = { name: `New app ${count}`, _id: id }
      return {
        ...state,
        items: [...state.items, newApp],
        selected: newApp,
      }
    })
  }
}

export const webpageStore = new WebpageStore()
