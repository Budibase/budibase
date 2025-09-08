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

  syncRecaptcha = (app: Workspace, key?: string) => {
    this.set({
      available: !!key,
      enabled: !!app.recaptchaEnabled && !!key,
    })
  }

  async setState(enabled: boolean) {
    const appId = get(appStore).appId
    await API.saveAppMetadata(appId, { recaptchaEnabled: enabled })
    this.update(state => {
      state.enabled = state.available && enabled
      return state
    })
  }
}

export const recaptchaStore = new RecaptchaStore()
