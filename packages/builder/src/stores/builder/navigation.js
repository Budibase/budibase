import { get } from "svelte/store"
import { API } from "api"
import { appStore } from "stores/builder"
import BudiStore from "../BudiStore"

export const INITIAL_NAVIGATION_STATE = {
  navigation: "Top",
  links: [],
  title: null,
  sticky: null,
  hideLogo: null,
  logoUrl: null,
  hideTitle: null,
  textAlign: "Left",
  navBackground: null,
  navWidth: null,
  navTextColor: null,
}

export class NavigationStore extends BudiStore {
  constructor() {
    super(INITIAL_NAVIGATION_STATE)
  }

  syncAppNavigation(nav) {
    this.update(state => ({
      ...state,
      ...nav,
    }))
  }

  reset() {
    this.store.set({ ...INITIAL_NAVIGATION_STATE })
  }

  async save(navigation) {
    const appId = get(appStore).appId
    const app = await API.saveAppMetadata({
      appId,
      metadata: { navigation },
    })
    this.syncAppNavigation(app.navigation)
  }

  async saveLink(url, title, roleId) {
    const navigation = get(this.store)
    let links = [...(navigation?.links ?? [])]

    // Skip if we have an identical link
    if (links.find(link => link.url === url && link.text === title)) {
      return
    }

    links.push({
      text: title,
      url,
      type: "link",
      roleId,
    })
    await this.save({
      ...navigation,
      links: [...links],
    })
  }

  async deleteLink(urls) {
    const navigation = get(this.store)
    let links = navigation?.links
    if (!links?.length) {
      return
    }
    urls = Array.isArray(urls) ? urls : [urls]

    // Filter out top level links pointing to these URLs
    links = links.filter(link => !urls.includes(link.url))

    // Filter out nested links pointing to these URLs
    links.forEach(link => {
      if (link.type === "sublinks" && link.subLinks?.length) {
        link.subLinks = link.subLinks.filter(
          subLink => !urls.includes(subLink.url)
        )
      }
    })

    await this.save({
      ...navigation,
      links,
    })
  }

  syncMetadata(metadata) {
    const { navigation } = metadata
    this.syncAppNavigation(navigation)
  }
}

export const navigationStore = new NavigationStore()
