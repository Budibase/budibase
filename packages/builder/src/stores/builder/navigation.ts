import { derived, get, Writable } from "svelte/store"
import { API } from "@/api"
import { appStore, workspaceAppStore } from "@/stores/builder"
import { DerivedBudiStore } from "../BudiStore"
import { AppNavigation, AppNavigationLink, UIObject } from "@budibase/types"
import { featureFlags } from "../portal"
import { notifications } from "@budibase/bbui"

export interface AppNavigationStore extends AppNavigation {}

export const INITIAL_NAVIGATION_STATE: AppNavigationStore = {
  navigation: "Top",
  links: [],
  textAlign: "Left",
}

export interface DerivedAppNavigationStore extends AppNavigationStore {}

export class NavigationStore extends DerivedBudiStore<
  AppNavigationStore,
  DerivedAppNavigationStore
> {
  constructor() {
    const makeDerivedStore = (store: Writable<AppNavigationStore>) => {
      return derived(
        [store, workspaceAppStore, featureFlags],
        ([$store, $workspaceAppStore, $featureFlags]) => {
          if (!$featureFlags.WORKSPACE_APPS) {
            return $store
          }
          const navigation = $workspaceAppStore.selectedWorkspaceApp?.navigation

          return {
            ...$store,
            ...(navigation ?? INITIAL_NAVIGATION_STATE),
          }
        }
      )
    }

    super(INITIAL_NAVIGATION_STATE, makeDerivedStore)
  }

  syncAppNavigation(nav?: AppNavigation) {
    this.update(state => ({
      ...state,
      ...nav,
    }))
  }

  reset() {
    this.store.set({ ...INITIAL_NAVIGATION_STATE })
  }

  async save(navigation: AppNavigation) {
    const { selectedWorkspaceApp } = get(workspaceAppStore)
    if (!selectedWorkspaceApp) {
      notifications.error("Non selected workspace app")
      return
    }

    await API.navigation.updateNavigation(selectedWorkspaceApp._id!, {
      navigation,
    })
    this.syncAppNavigation(navigation)
  }

  async addLink({
    url,
    title,
    roleId,
  }: {
    url: string
    title: string
    roleId: string
  }) {
    const navigation = get(this.store)
    let links: AppNavigationLink[] = [...(navigation?.links ?? [])]

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

    this.syncAppNavigation({
      ...navigation,
      links: [...links],
    })
  }

  async deleteLink(urls: string[] | string) {
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

  syncMetadata(metadata: UIObject) {
    const { navigation } = metadata
    this.syncAppNavigation(navigation)
  }

  async refresh() {
    const appId = get(appStore).appId
    const appPackage = await API.fetchAppPackage(appId)

    this.syncAppNavigation(appPackage.application.navigation)
  }
}

export const navigationStore = new NavigationStore()
