import { BannerType } from "@/constants/banners"
import { BudiStore } from "../BudiStore"
import { derived, Readable } from "svelte/store"

interface BannerState {
  closedBanners: Set<BannerType>
}

class BannerStore extends BudiStore<BannerState> {
  constructor() {
    super({
      closedBanners: new Set<BannerType>(),
    })
  }

  shouldDisplayBanner(type: BannerType): Readable<boolean> {
    return derived(this.store, $state => {
      return !$state.closedBanners.has(type)
    })
  }

  closeBanner(type: BannerType) {
    this.store.update(state => {
      state.closedBanners.add(type)
      return state
    })
  }
}

export const bannerStore = new BannerStore()
