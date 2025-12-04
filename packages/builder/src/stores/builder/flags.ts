import { API } from "@/api"
import { GetUserFlagsResponse } from "@budibase/types"
import { BudiStore } from "../BudiStore"

// Per workspace doc containing all flags set by the
// the user e.g. queryTransformerBanner
export class FlagsStore extends BudiStore<GetUserFlagsResponse> {
  constructor() {
    super({})

    this.fetch = this.fetch.bind(this)
    this.updateFlag = this.updateFlag.bind(this)
  }

  async fetch() {
    const flags = await API.getFlags()
    this.set(flags)
  }

  async updateFlag(flag: string, value: any) {
    await API.updateFlag(flag, value)
    await this.fetch()
  }
}

export const flags = new FlagsStore()
