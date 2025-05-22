import { derived, get, Readable } from "svelte/store"
import { API } from "@/api"
import { appStore, screenStore, selectedScreen } from "@/stores/builder"
import { DerivedBudiStore } from "../BudiStore"
import {
  AppNavigation,
  FeatureFlag,
  UIObject,
  UIWorkspaceApp,
} from "@budibase/types"
import { featureFlag } from "@/helpers"

interface NavigationStoreState extends AppNavigation {
  navigationPerWorkspaceApp: Record<string, AppNavigation>
}

export const INITIAL_NAVIGATION_STATE: NavigationStoreState = {
  navigation: "Top",
  links: [],
  navigationPerWorkspaceApp: {},
  textAlign: "Left",
}

interface DerivedNavigationStoreState extends AppNavigation {}

export class NavigationStore extends DerivedBudiStore<
  NavigationStoreState,
  DerivedNavigationStoreState
> {
  constructor() {
    const makeDerivedStore = (store: Readable<NavigationStoreState>) => {
      return derived(
        [store, selectedScreen, screenStore],
        ([$store, $selectedScreen, $screenStore]) => {
          const currentScreenLinks = $screenStore.screens
            .filter(s => s.workspaceAppId === $selectedScreen?.workspaceAppId)
            .map(s => s.routing.route)

          let links = $store.links?.filter(l =>
            currentScreenLinks.includes(l.url)
          )

          const workspaceAppsEnabled = featureFlag.isEnabled(
            FeatureFlag.WORKSPACE_APPS
          )

          if (workspaceAppsEnabled && $selectedScreen) {
            return $store.navigationPerWorkspaceApp[
              $selectedScreen.workspaceAppId!
            ]
          }

          return { ...$store, links }
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

  syncWorkspaceAppsNavigation(workspaceApps: UIWorkspaceApp[]) {
    this.update(state => ({
      ...state,
      navigationPerWorkspaceApp: workspaceApps.reduce<
        Record<string, AppNavigation>
      >((acc, a) => {
        acc[a._id!] = a.navigation
        return acc
      }, {}),
    }))
  }

  reset() {
    this.store.set({ ...INITIAL_NAVIGATION_STATE })
  }

  async save(navigation: NavigationStoreState) {
    const appId = get(appStore).appId
    const app = await API.saveAppMetadata(appId, { navigation })
    if (app.navigation) {
      this.syncAppNavigation({
        navigation:
          app.navigation?.navigation ?? INITIAL_NAVIGATION_STATE.navigation,
        links: app.navigation.links ?? INITIAL_NAVIGATION_STATE.links,
        textAlign:
          app.navigation.textAlign ?? INITIAL_NAVIGATION_STATE.textAlign,
      })
    }
  }

  async saveLink(
    url: string,
    title: string,
    roleId: string,
    workspaceAppId: string
  ) {
    const workspaceAppsEnabled = featureFlag.isEnabled(
      FeatureFlag.WORKSPACE_APPS
    )

    const navigation = get(this.store)
    const links = workspaceAppsEnabled
      ? [...(navigation.navigationPerWorkspaceApp[workspaceAppId]?.links || [])]
      : [...(navigation.links ?? [])]

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

    if (!workspaceAppsEnabled) {
      await this.save({
        ...navigation,
        links: [...links],
      })
    } else {
      this.update(state => {
        state.navigationPerWorkspaceApp[workspaceAppId].links = links
        return { ...state }
      })
    }
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
}

export const navigationStore = new NavigationStore()
