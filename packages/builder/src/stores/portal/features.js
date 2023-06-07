import { writable } from "svelte/store"
import { API } from "api"
import { licensing } from "./licensing"
import { ConfigType } from "@budibase/types"

export const createFeatureStore = () => {
  const internalStore = writable({
    scim: {
      isFeatureFlagEnabled: false,
      isConfigFlagEnabled: false,
    },
  })

  const store = writable({
    isScimEnabled: false,
  })

  internalStore.subscribe(s => {
    store.update(state => ({
      ...state,
      isScimEnabled: s.scim.isFeatureFlagEnabled && s.scim.isConfigFlagEnabled,
    }))
  })

  licensing.subscribe(v => {
    internalStore.update(state => ({
      ...state,
      scim: {
        ...state.scim,
        isFeatureFlagEnabled: v.scimEnabled,
      },
    }))
  })

  const actions = {
    init: async () => {
      const scimConfig = await API.getConfig(ConfigType.SCIM)
      internalStore.update(state => ({
        ...state,
        scim: {
          ...state.scim,
          isConfigFlagEnabled: scimConfig?.config?.enabled,
        },
      }))
    },
  }

  return {
    subscribe: store.subscribe,
    ...actions,
  }
}

export const features = createFeatureStore()
