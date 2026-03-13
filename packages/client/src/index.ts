import ClientApp from "./components/ClientApp.svelte"
import UpdatingApp from "./components/UpdatingApp.svelte"
import {
  authStore,
  builderStore,
  appStore,
  blockStore,
  componentStore,
  environmentStore,
  dndStore,
  eventStore,
  hoverStore,
  stateStore,
  routeStore,
  notificationStore,
} from "@/stores"
import { mount, unmount } from "svelte"
import { get } from "svelte/store"
import { initWebsocket } from "@/websocket"
import {
  Screen,
  Theme,
  AppCustomTheme,
  PreviewDevice,
  AppNavigation,
  Plugin,
  Snippet,
  UIComponentError,
  CustomComponent,
  Table,
  DataFetchDatasource,
} from "@budibase/types"
import { ActionTypes } from "@/constants"
import { APIClient } from "@budibase/frontend-core"
import BlockComponent from "./components/BlockComponent.svelte"
import Block from "./components/Block.svelte"
import { API } from "./api"

// Expose Svelte modules globally for plugin compatibility
import "@/svelteGlobals"

// Set up global PWA install prompt handler
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault()
    window.deferredPwaPrompt = e
  })
}

// Extend global window scope
declare global {
  interface Window {
    // Data from builder
    "##BUDIBASE_APP_ID##": string
    "##BUDIBASE_IN_BUILDER##"?: true
    "##BUDIBASE_PREVIEW_SCREEN##"?: Screen
    "##BUDIBASE_SELECTED_COMPONENT_ID##"?: string
    "##BUDIBASE_PREVIEW_ID##"?: number
    "##BUDIBASE_PREVIEW_THEME##"?: Theme
    "##BUDIBASE_PREVIEW_CUSTOM_THEME##"?: AppCustomTheme
    "##BUDIBASE_PREVIEW_DEVICE##"?: PreviewDevice
    "##BUDIBASE_PREVIEW_MODAL_DEVICE##"?: PreviewDevice
    "##BUDIBASE_APP_EMBEDDED##"?: string // This is a bool wrapped in a string
    "##BUDIBASE_EMBED_LOCATION##"?: string
    "##BUDIBASE_PREVIEW_NAVIGATION##"?: AppNavigation
    "##BUDIBASE_HIDDEN_COMPONENT_IDS##"?: string[]
    "##BUDIBASE_USED_PLUGINS##"?: Plugin[]
    "##BUDIBASE_SNIPPETS##"?: Snippet[]
    "##BUDIBASE_COMPONENT_ERRORS##"?: Record<string, UIComponentError[]>
    "##BUDIBASE_CUSTOM_COMPONENTS##"?: CustomComponent[]

    // Other flags
    MIGRATING_APP: boolean

    // PWA install prompt
    deferredPwaPrompt: any

    // Client additions
    handleBuilderRuntimeEvent: (type: string, data: any) => void
    registerCustomComponent: typeof componentStore.actions.registerCustomComponent
    loadBudibase: typeof loadBudibase
    INIT_TIME: number
  }
}

export interface SDK {
  API: APIClient
  styleable: any
  Provider: any
  ActionTypes: typeof ActionTypes
  fetchDatasourceSchema: any
  fetchDatasourceDefinition: (datasource: DataFetchDatasource) => Promise<Table>
  getRelationshipSchemaAdditions: (schema: Record<string, any>) => Promise<any>
  enrichButtonActions: any
  generateGoldenSample: any
  createContextStore: any
  builderStore: typeof builderStore
  authStore: typeof authStore
  notificationStore: typeof notificationStore
  environmentStore: typeof environmentStore
  appStore: typeof appStore
  Block: typeof Block
  BlockComponent: typeof BlockComponent
}

let app: Parameters<typeof unmount>[0] | undefined

export interface MountBudibaseAppOptions {
  target: HTMLElement
  appUrl: string
  appId?: string
  embedded?: boolean
}

interface LoadBudibaseOptions {
  target?: HTMLElement
}

const getPathname = (pathOrUrl: string) => {
  if (!pathOrUrl) {
    return ""
  }
  if (pathOrUrl.startsWith("/")) {
    return pathOrUrl.split("#")[0].split("?")[0]
  }
  try {
    return new URL(pathOrUrl, window.location.origin).pathname
  } catch (error) {
    return pathOrUrl
  }
}

const getHash = (pathOrUrl: string) => {
  if (!pathOrUrl) {
    return ""
  }
  if (pathOrUrl.startsWith("/")) {
    const [, hash = ""] = pathOrUrl.split("#")
    return hash ? `#${hash}` : ""
  }
  try {
    return new URL(pathOrUrl, window.location.origin).hash
  } catch (error) {
    return ""
  }
}

const normalizeAppPath = (pathOrUrl: string) => {
  const pathname = getPathname(pathOrUrl).replace(/\/$/, "")
  if (!pathname) {
    return ""
  }
  if (pathname.startsWith("/app/") || pathname.startsWith("/app-chat/")) {
    return pathname
  }
  return pathname.startsWith("/") ? `/app${pathname}` : `/app/${pathname}`
}

const resolveAppIdFromPath = async (appPath: string) => {
  const publishedApps = await API.getPublishedApps()
  const pathToMatch = appPath.replace(/\/$/, "")
  const matched = publishedApps.find(app => {
    return [`/app${app.url}`, `/app-chat${app.url}`].includes(pathToMatch)
  })
  if (!matched?.prodId) {
    throw new Error(`Could not resolve Budibase app for path: ${appPath}`)
  }
  return matched.prodId
}

const loadBudibase = async (options: LoadBudibaseOptions = {}) => {
  const target = options.target || window.document.body
  // Update builder store with any builder flags
  builderStore.set({
    ...get(builderStore),
    inBuilder: !!window["##BUDIBASE_IN_BUILDER##"],
    screen: window["##BUDIBASE_PREVIEW_SCREEN##"],
    selectedComponentId: window["##BUDIBASE_SELECTED_COMPONENT_ID##"],
    previewId: window["##BUDIBASE_PREVIEW_ID##"],
    theme: window["##BUDIBASE_PREVIEW_THEME##"],
    customTheme: window["##BUDIBASE_PREVIEW_CUSTOM_THEME##"],
    previewDevice: window["##BUDIBASE_PREVIEW_DEVICE##"],
    previewModalDevice: window["##BUDIBASE_PREVIEW_MODAL_DEVICE##"],
    navigation: window["##BUDIBASE_PREVIEW_NAVIGATION##"],
    hiddenComponentIds: window["##BUDIBASE_HIDDEN_COMPONENT_IDS##"],
    usedPlugins: window["##BUDIBASE_USED_PLUGINS##"],
    snippets: window["##BUDIBASE_SNIPPETS##"],
    componentErrors: window["##BUDIBASE_COMPONENT_ERRORS##"],
  })

  // Set app ID - this window flag is set by both the preview and the real
  // server rendered app HTML
  appStore.actions.setAppId(window["##BUDIBASE_APP_ID##"])

  // Set the flag used to determine if the app is being loaded via an iframe
  appStore.actions.setAppEmbedded(
    window["##BUDIBASE_APP_EMBEDDED##"] === "true"
  )

  if (window.MIGRATING_APP) {
    if (!app) {
      app = mount(UpdatingApp, {
        target,
      })
    }
    return
  }

  // Fetch environment info
  if (!get(environmentStore)?.loaded) {
    await environmentStore.actions.fetchEnvironment()
  }

  // Register handler for runtime events from the builder
  window.handleBuilderRuntimeEvent = (type, data) => {
    if (!window["##BUDIBASE_IN_BUILDER##"]) {
      return
    }
    if (type === "event-completed") {
      eventStore.actions.resolveEvent(data)
    } else if (type === "eject-block") {
      const block = blockStore.actions.getBlock(data)
      block?.eject()
    } else if (type === "dragging-new-component") {
      const { dragging, component } = data
      if (dragging) {
        dndStore.actions.startDraggingNewComponent(component)
      } else {
        dndStore.actions.reset()
      }
    } else if (type === "request-context") {
      const { selectedComponentInstance, screenslotInstance } =
        get(componentStore)
      const instance = selectedComponentInstance || screenslotInstance
      const context = instance?.getDataContext()
      let stringifiedContext = null
      try {
        stringifiedContext = JSON.stringify(context)
      } catch (error) {
        // Ignore - invalid context
      }
      eventStore.actions.dispatchEvent("provide-context", {
        context: stringifiedContext,
      })
    } else if (type === "hover-component") {
      hoverStore.actions.hoverComponent(data, false)
    } else if (type === "builder-meta") {
      builderStore.actions.setMetadata(data)
    } else if (type === "builder-state") {
      const [[key, value]] = Object.entries(data)
      stateStore.actions.setValue(key, value)
    } else if (type === "builder-url-test-data") {
      const { route, testValue } = data
      routeStore.actions.setTestUrlParams(route, testValue)
    }
  }

  // Register any custom components
  if (window["##BUDIBASE_CUSTOM_COMPONENTS##"]) {
    window["##BUDIBASE_CUSTOM_COMPONENTS##"].forEach(component => {
      componentStore.actions.registerCustomComponent(component)
    })
  }

  // Make a callback available for custom component bundles to register
  // themselves at runtime
  window.registerCustomComponent =
    componentStore.actions.registerCustomComponent

  // Initialise websocket
  initWebsocket()

  // Create app if one hasn't been created yet
  if (!app) {
    app = mount(ClientApp, {
      target,
    })
  }
}

// Attach to window so the HTML template can call this when it loads
window.loadBudibase = loadBudibase

export const mountBudibaseApp = async ({
  target,
  appUrl,
  appId,
  embedded = true,
}: MountBudibaseAppOptions) => {
  if (!target || !(target instanceof HTMLElement)) {
    throw new Error("mountBudibaseApp requires a target HTMLElement")
  }

  const appPath = normalizeAppPath(appUrl)
  const appHash = getHash(appUrl)
  if (!appPath) {
    throw new Error("mountBudibaseApp requires a valid appUrl")
  }

  const resolvedAppId = appId || (await resolveAppIdFromPath(appPath))

  window["##BUDIBASE_APP_ID##"] = resolvedAppId
  window["##BUDIBASE_APP_EMBEDDED##"] = String(embedded)
  window["##BUDIBASE_EMBED_LOCATION##"] = appPath

  if (appHash && window.location.hash !== appHash) {
    window.location.hash = appHash
  }

  if (app) {
    throw new Error(
      "Budibase is already mounted. Unmount the existing instance before mounting again."
    )
  }
  await loadBudibase({ target })

  return () => {
    if (app) {
      unmount(app)
      app = undefined
    }
  }
}
