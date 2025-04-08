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

// Set up global PWA install prompt handler
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault()
    window.deferredPwaPrompt = e
  })
}

// Provide svelte and svelte/internal as globals for custom components
import * as svelte from "svelte"
// @ts-ignore
import * as internal from "svelte/internal"
window.svelte_internal = internal
window.svelte = svelte

// Initialise spectrum icons
// eslint-disable-next-line local-rules/no-budibase-imports
import loadSpectrumIcons from "@budibase/bbui/spectrum-icons-vite.js"
loadSpectrumIcons()

// Extend global window scope
declare global {
  interface Window {
    // Data from builder
    "##BUDIBASE_APP_ID##"?: string
    "##BUDIBASE_IN_BUILDER##"?: true
    "##BUDIBASE_PREVIEW_SCREEN##"?: Screen
    "##BUDIBASE_SELECTED_COMPONENT_ID##"?: string
    "##BUDIBASE_PREVIEW_ID##"?: number
    "##BUDIBASE_PREVIEW_THEME##"?: Theme
    "##BUDIBASE_PREVIEW_CUSTOM_THEME##"?: AppCustomTheme
    "##BUDIBASE_PREVIEW_DEVICE##"?: PreviewDevice
    "##BUDIBASE_APP_EMBEDDED##"?: string // This is a bool wrapped in a string
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
    svelte: typeof svelte
    svelte_internal: typeof internal
  }
}

export interface SDK {
  API: APIClient
  styleable: any
  Provider: any
  ActionTypes: typeof ActionTypes
  fetchDatasourceSchema: any
  fetchDatasourceDefinition: (datasource: DataFetchDatasource) => Promise<Table>
  generateGoldenSample: any
  builderStore: typeof builderStore
  authStore: typeof authStore
  notificationStore: typeof notificationStore
  environmentStore: typeof environmentStore
  appStore: typeof appStore
  Block: typeof Block
  BlockComponent: typeof BlockComponent
}

let app: ClientApp

const loadBudibase = async () => {
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
    new UpdatingApp({
      target: window.document.body,
    })
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
    app = new ClientApp({
      target: window.document.body,
    })
  }
}

// Attach to window so the HTML template can call this when it loads
window.loadBudibase = loadBudibase
