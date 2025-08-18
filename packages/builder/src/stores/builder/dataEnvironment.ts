import { DataEnvironmentMode } from "@budibase/types"
import { BudiStore, PersistenceType } from "../BudiStore"
import { derived } from "svelte/store"
import { API, productionAPI } from "@/api"

interface DataEnvironmentState {
  mode: DataEnvironmentMode
  bannerHidden: boolean
}

export const initialState: DataEnvironmentState = {
  mode: DataEnvironmentMode.DEVELOPMENT,
  bannerHidden: false,
}

export class DataEnvironmentStore extends BudiStore<DataEnvironmentState> {
  constructor() {
    super(initialState, {
      persistence: {
        type: PersistenceType.LOCAL,
        key: "bb-data-environment",
      },
    })

    this.setMode = this.setMode.bind(this)
    this.toggleMode = this.toggleMode.bind(this)
  }

  setMode(mode: DataEnvironmentMode) {
    this.update(state => ({
      ...state,
      mode,
    }))
  }

  toggleMode() {
    this.update(state => ({
      ...state,
      mode:
        state.mode === DataEnvironmentMode.DEVELOPMENT
          ? DataEnvironmentMode.PRODUCTION
          : DataEnvironmentMode.DEVELOPMENT,
    }))
  }

  hideBanner() {
    this.update(state => ({
      ...state,
      bannerHidden: true,
    }))
  }
}

export const dataEnvironmentStore = new DataEnvironmentStore()

export const dataAPI = derived(dataEnvironmentStore, $dataEnvironmentStore =>
  $dataEnvironmentStore.mode === DataEnvironmentMode.PRODUCTION
    ? productionAPI
    : API
)
