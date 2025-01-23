import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import {
  App,
  AppFeatures,
  AppIcon,
  AutomationSettings,
  Plugin,
} from "@budibase/types"

interface ClientFeatures {
  spectrumThemes: boolean
  intelligentLoading: boolean
  deviceAwareness: boolean
  state: boolean
  rowSelection: boolean
  customThemes: boolean
  devicePreview: boolean
  messagePassing: boolean
  continueIfAction: boolean
  showNotificationAction: boolean
  sidePanel: boolean
}

interface TypeSupportPresets {
  [key: string]: any
}

interface AppMetaState {
  appId: string
  name: string
  url: string
  libraries: string[]
  clientFeatures: ClientFeatures
  typeSupportPresets: TypeSupportPresets
  features: AppFeatures
  clientLibPath: string
  hasLock: boolean
  appInstance: { _id: string } | null
  initialised: boolean
  hasAppPackage: boolean
  usedPlugins: Plugin[] | null
  automations: AutomationSettings
  routes: { [key: string]: any }
  version?: string
  revertableVersion?: string
  upgradableVersion?: string
  icon?: AppIcon
}

export const INITIAL_APP_META_STATE: AppMetaState = {
  appId: "",
  name: "",
  url: "",
  libraries: [],
  clientFeatures: {
    spectrumThemes: false,
    intelligentLoading: false,
    deviceAwareness: false,
    state: false,
    rowSelection: false,
    customThemes: false,
    devicePreview: false,
    messagePassing: false,
    continueIfAction: false,
    showNotificationAction: false,
    sidePanel: false,
  },
  typeSupportPresets: {},
  features: {
    componentValidation: false,
    disableUserMetadata: false,
  },
  clientLibPath: "",
  hasLock: true,
  appInstance: null,
  initialised: false,
  hasAppPackage: false,
  usedPlugins: null,
  automations: {},
  routes: {},
}

export class AppMetaStore extends BudiStore<AppMetaState> {
  constructor() {
    super(INITIAL_APP_META_STATE)
  }

  reset() {
    this.store.set({ ...INITIAL_APP_META_STATE })
  }

  syncAppPackage(pkg: {
    application: App
    clientLibPath: string
    hasLock: boolean
  }) {
    const { application: app, clientLibPath, hasLock } = pkg

    this.update(state => ({
      ...state,
      name: app.name,
      appId: app.appId,
      url: app.url || "",
      hasLock,
      clientLibPath,
      libraries: app.componentLibraries,
      version: app.version,
      appInstance: app.instance,
      revertableVersion: app.revertableVersion,
      upgradableVersion: app.upgradableVersion,
      usedPlugins: app.usedPlugins || null,
      icon: app.icon,
      features: {
        ...INITIAL_APP_META_STATE.features,
        ...app.features,
      },
      initialised: true,
      automations: app.automations || {},
      hasAppPackage: true,
    }))
  }

  syncClientFeatures(features: Partial<ClientFeatures>) {
    this.update(state => ({
      ...state,
      clientFeatures: {
        ...INITIAL_APP_META_STATE.clientFeatures,
        ...features,
      },
    }))
  }

  syncClientTypeSupportPresets(typeSupportPresets: TypeSupportPresets) {
    this.update(state => ({
      ...state,
      typeSupportPresets,
    }))
  }

  async syncAppRoutes() {
    const resp = await API.fetchAppRoutes()
    this.update(state => ({
      ...state,
      routes: resp.routes,
    }))
  }

  // Returned from socket
  syncMetadata(metadata: { name: string; url: string; icon?: AppIcon }) {
    const { name, url, icon } = metadata
    this.update(state => ({
      ...state,
      name,
      url,
      icon,
    }))
  }
}

export const appStore = new AppMetaStore()
