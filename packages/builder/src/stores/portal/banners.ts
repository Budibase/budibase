import { BannerType } from "@/constants/banners"
import { BudiStore } from "../BudiStore"
import { derived, Readable } from "svelte/store"

interface BannerState {
  closedBanners: Set<BannerType>
}

export class BannerStore extends BudiStore<BannerState> {
  static STORAGE_KEY_PREFIX = "closed-banners"

  constructor() {
    let closedBanners = new Set<BannerType>()
    const storageItem = localStorage.getItem(BannerStore.STORAGE_KEY_PREFIX)
    if (storageItem) {
      closedBanners = new Set<BannerType>(JSON.parse(storageItem))
    }

    super({
      closedBanners,
    })

    this.store.subscribe($store => {
      localStorage.setItem(
        BannerStore.STORAGE_KEY_PREFIX,
        JSON.stringify([...$store.closedBanners])
      )
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
