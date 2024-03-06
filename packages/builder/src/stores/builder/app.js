import { API } from "api"
import BudiStore from "./BudiStore"

export const INITIAL_APP_META_STATE = {
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

export class AppMetaStore extends BudiStore {
  constructor() {
    super(INITIAL_APP_META_STATE)
  }

  reset() {
    this.store.set({ ...INITIAL_APP_META_STATE })
  }

  syncAppPackage(pkg) {
    const { application: app, clientLibPath, hasLock } = pkg

    this.update(state => ({
      ...state,
      name: app.name,
      appId: app.appId,
      url: app.url,
      hasLock,
      clientLibPath,
      libraries: app.componentLibraries,
      version: app.version,
      appInstance: app.instance,
      revertableVersion: app.revertableVersion,
      upgradableVersion: app.upgradableVersion,
      usedPlugins: app.usedPlugins,
      icon: app.icon || {},
      features: {
        ...INITIAL_APP_META_STATE.features,
        ...app.features,
      },
      initialised: true,
      automations: app.automations || {},
      hasAppPackage: true,
    }))
  }

  syncClientFeatures(features) {
    this.update(state => ({
      ...state,
      clientFeatures: {
        ...INITIAL_APP_META_STATE.clientFeatures,
        ...features,
      },
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
  syncMetadata(metadata) {
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
