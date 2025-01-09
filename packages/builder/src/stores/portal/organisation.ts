import { get } from "svelte/store"
import { API } from "@/api"
import { auth } from "@/stores/portal"
import {
  ConfigType,
  PublicSettingsInnerConfig,
  SettingsBrandingConfig,
  SettingsInnerConfig,
} from "@budibase/types"
import { BudiStore } from "../BudiStore"

interface LocalOrganisationState {
  loaded: boolean
}

type SavedOrganisationState = SettingsInnerConfig & SettingsBrandingConfig
type OrganisationState = SavedOrganisationState &
  PublicSettingsInnerConfig &
  LocalOrganisationState

const DEFAULT_STATE: OrganisationState = {
  platformUrl: "",
  emailBrandingEnabled: true,
  testimonialsEnabled: true,
  platformTitle: "Budibase",
  company: "Budibase",
  google: false,
  googleDatasourceConfigured: false,
  oidc: false,
  oidcCallbackUrl: "",
  googleCallbackUrl: "",
  loaded: false,
}

class OrganisationStore extends BudiStore<OrganisationState> {
  constructor() {
    super(DEFAULT_STATE)
  }

  async init() {
    const tenantId = get(auth).tenantId
    const settingsConfigDoc = await API.getTenantConfig(tenantId)
    this.set({ ...DEFAULT_STATE, ...settingsConfigDoc.config, loaded: true })
  }

  async save(changes: Partial<SavedOrganisationState>) {
    // Strip non persisted fields
    const {
      oidc,
      google,
      googleDatasourceConfigured,
      oidcCallbackUrl,
      googleCallbackUrl,
      loaded,
      ...config
    } = get(this.store)

    // Save new config
    const newConfig: SavedOrganisationState = {
      ...config,
      ...changes,
    }
    await API.saveConfig({
      type: ConfigType.SETTINGS,
      config: newConfig,
    })
    await this.init()
  }
}

export const organisation = new OrganisationStore()
