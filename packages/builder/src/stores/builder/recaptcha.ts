import { API } from "@/api"
import { appStore } from "@/stores/builder"
import { Workspace } from "@budibase/types"
import { get } from "svelte/store"
import { BudiStore } from "../BudiStore"

interface RecaptchaState {
  available: boolean
  enabled: boolean
}

export class RecaptchaStore extends BudiStore<RecaptchaState> {
  constructor() {
    super({
      available: false,
      enabled: false,
    })
  }

  syncRecaptcha = (workspace: Workspace, key?: string) => {
    this.set({
      available: !!key,
      enabled: !!workspace.features?.recaptchaEnabled && !!key,
    })
  }

  setAvailable = (available: boolean) => {
    this.update(state => {
      state.available = available
      state.enabled = state.enabled && available
      return state
    })
  }

  async setState(enabled: boolean) {
    const appId = get(appStore).appId
    await API.saveAppMetadata(appId, {
      features: { recaptchaEnabled: enabled },
    })
    this.update(state => {
      state.enabled = state.available && enabled
      return state
    })
  }
}

export const recaptchaStore = new RecaptchaStore()
