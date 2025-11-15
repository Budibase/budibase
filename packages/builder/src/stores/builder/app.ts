import { API } from "@/api"
import {
  AppScript,
  AutomationSettings,
  Plugin,
  PWAManifest,
  TranslationOverrides,
  UpdateWorkspaceRequest,
  Workspace,
  WorkspaceFeatures,
  WorkspaceIcon,
} from "@budibase/types"
import { get } from "svelte/store"
import { initialise, navigationStore, workspaceAppStore } from "."
import { BudiStore } from "../BudiStore"
import { resolveWorkspaceTranslations } from "@budibase/shared-core"

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

export interface AppMetaState {
  appId: string
  name: string
  url: string
  libraries: string[]
  clientFeatures: ClientFeatures
  typeSupportPresets: TypeSupportPresets
  features: WorkspaceFeatures
  clientLibPath: string
  hasLock: boolean
  appInstance: { _id: string } | null
  initialised: boolean
  hasAppPackage: boolean
  usedPlugins: Plugin[]
  automations: AutomationSettings
  routes: { [key: string]: any }
  version?: string
  revertableVersion?: string
  upgradableVersion?: string
  icon?: WorkspaceIcon
  pwa?: PWAManifest
  scripts: AppScript[]
  translationOverrides: TranslationOverrides
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
  usedPlugins: [],
  automations: {},
  routes: {},
  pwa: {
    name: "",
    short_name: "",
    description: "",
    icons: [],
    background_color: "",
    theme_color: "",
    start_url: "",
    screenshots: [],
  },
  scripts: [],
  translationOverrides: {},
}

export class AppMetaStore extends BudiStore<AppMetaState> {
  constructor() {
    super(INITIAL_APP_META_STATE)
  }

  reset() {
    this.store.set({ ...INITIAL_APP_META_STATE })
  }

  syncApp(workspace: Workspace) {
    const translationOverrides = resolveWorkspaceTranslations(
      workspace.translationOverrides
    )

    this.update(state => ({
      ...state,
      name: workspace.name,
      appId: workspace.appId,
      url: workspace.url || "",
      libraries: workspace.componentLibraries,
      version: workspace.version,
      appInstance: workspace.instance,
      revertableVersion: workspace.revertableVersion,
      upgradableVersion: workspace.upgradableVersion,
      usedPlugins: workspace.usedPlugins || [],
      icon: workspace.icon,
      features: {
        ...INITIAL_APP_META_STATE.features,
        ...workspace.features,
      },
      initialised: true,
      automations: workspace.automations || {},
      hasAppPackage: true,
      pwa: workspace.pwa,
      scripts: workspace.scripts || [],
      translationOverrides,
    }))
  }

  syncAppPackage(pkg: {
    application: Workspace
    clientLibPath: string
    hasLock: boolean
  }) {
    const { application, clientLibPath, hasLock } = pkg
    this.update(state => ({
      ...state,
      hasLock,
      clientLibPath,
    }))
    this.syncApp(application)
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

  async updateApp(updates: UpdateWorkspaceRequest) {
    const app = await API.saveAppMetadata(get(this.store).appId, updates)
    this.syncApp(app)
  }

  // Returned from socket
  syncMetadata(metadata: { name: string; url: string; icon?: WorkspaceIcon }) {
    const { name, url, icon } = metadata
    this.update(state => ({
      ...state,
      name,
      url,
      icon,
      pwa: {
        ...state.pwa,
        name: state.pwa?.name || "",
        short_name: state.pwa?.short_name || "",
        description: state.pwa?.description || "",
        icons: state.pwa?.icons || [],
        background_color: state.pwa?.background_color || "",
        theme_color: state.pwa?.theme_color || "",
        start_url: state.pwa?.start_url || "",
        screenshots: state.pwa?.screenshots || [],
      },
    }))
  }

  async refresh() {
    const { appId } = get(this.store)
    const appPackage = await API.fetchAppPackage(appId)
    await initialise(appPackage)
  }

  async refreshAppNav() {
    const { selectedWorkspaceApp } = get(workspaceAppStore)
    if (!selectedWorkspaceApp) {
      return
    }

    const { navigation } = await API.workspaceApp.find(
      selectedWorkspaceApp._id!
    )
    navigationStore.syncAppNavigation(navigation)
  }
}

export const appStore = new AppMetaStore()
