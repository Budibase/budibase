import { derived, Writable } from "svelte/store"
import { API } from "@/api"
import { licensing } from "./licensing"
import { ConfigType, isConfig, isSCIMConfig } from "@budibase/types"
import { DerivedBudiStore } from "../BudiStore"

interface FeatureState {
  scimConfigEnabled: Boolean
}

interface DerivedFeatureState {
  isScimEnabled: Boolean
}

class FeatureStore extends DerivedBudiStore<FeatureState, DerivedFeatureState> {
  constructor() {
    const makeDerivedStore = (store: Writable<FeatureState>) => {
      return derived([store, licensing], ([$state, $licensing]) => ({
        isScimEnabled: $state.scimConfigEnabled && $licensing.scimEnabled,
      }))
    }
    super({ scimConfigEnabled: false }, makeDerivedStore)
  }

  async init() {
    const config = await API.getConfig(ConfigType.SCIM)
    this.update(state => ({
      ...state,
      scimConfigEnabled:
        isConfig(config) && isSCIMConfig(config) && config.config.enabled,
    }))
  }
}

export const features = new FeatureStore()
