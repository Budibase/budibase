import { API } from "@/api"
import { GetUserFlagsResponse } from "@budibase/types"
import { BudiStore } from "../BudiStore"

interface FlagsState {
  flags: GetUserFlagsResponse
}

const INITIAL_FLAGS_STATE: FlagsState = {
  flags: {},
}

export class FlagsStore extends BudiStore<FlagsState> {
  constructor() {
    super(INITIAL_FLAGS_STATE)

    this.fetch = this.fetch.bind(this)
    this.updateFlag = this.updateFlag.bind(this)
    this.toggleUiFeature = this.toggleUiFeature.bind(this)
  }

  async fetch() {
    const flags = await API.getFlags()
    this.update(state => ({
      ...state,
      flags,
    }))
  }

  async updateFlag(flag: string, value: any) {
    await API.updateFlag(flag, value)
    await this.fetch()
  }

  async toggleUiFeature(feature: string) {
    await API.toggleUiFeature(feature)
  }
}

export const flags = new FlagsStore()
