import { API } from "@/api"
import { banner } from "@budibase/bbui"
import {
  ConfigChecklistResponse,
  GetEnvironmentResponse,
  SystemStatusResponse,
} from "@budibase/types"
import { get } from "svelte/store"
import Analytics from "../../analytics"
import { BudiStore } from "../BudiStore"
import { auth } from "./auth"

export interface AdminState extends GetEnvironmentResponse {
  loaded: boolean
  checklist?: ConfigChecklistResponse
  status?: SystemStatusResponse
}

export class AdminStore extends BudiStore<AdminState> {
  constructor() {
    super({
      loaded: false,
      isDev: false,
      multiTenancy: false,
      cloud: false,
      disableAccountPortal: false,
      offlineMode: false,
      maintenance: [],
    })
  }

  async init() {
    await this.getChecklist()
    await this.getEnvironment()
    // enable system status checks in the cloud
    if (get(this.store).cloud) {
      // in cloud allow this
      Analytics.enableSessionRecording()
      await this.getSystemStatus()
      this.checkStatus()
    }
    this.update(store => {
      store.loaded = true
      return store
    })
  }

  async getEnvironment() {
    const environment = await API.getEnvironment()
    this.update(store => {
      store.isDev = environment.isDev
      store.multiTenancy = environment.multiTenancy
      store.cloud = environment.cloud
      store.disableAccountPortal = environment.disableAccountPortal
      store.accountPortalUrl = environment.accountPortalUrl
      store.baseUrl = environment.baseUrl
      store.offlineMode = environment.offlineMode
      store.maintenance = environment.maintenance
      store.passwordMinLength = environment.passwordMinLength

      return store
    })
  }

  async checkStatus() {
    const health = get(this.store).status?.health
    if (!health?.passing) {
      await banner.showStatus()
    }
  }

  async getSystemStatus() {
    const status = await API.getSystemStatus()
    this.update(store => {
      store.status = status
      return store
    })
  }

  async getChecklist() {
    const tenantId = get(auth).tenantId
    const checklist = await API.getChecklist(tenantId)
    this.update(store => {
      store.checklist = checklist
      return store
    })
  }

  unload() {
    this.update(store => {
      store.loaded = false
      return store
    })
  }
}

export const admin = new AdminStore()
