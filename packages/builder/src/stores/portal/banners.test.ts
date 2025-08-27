import { it, expect, describe, beforeEach, afterEach, vi } from "vitest"
import { get } from "svelte/store"
import { BannerType } from "@/constants/banners"
import { BannerStore } from "./banners"

describe("BannerStore", () => {
  const STORAGE_KEY = BannerStore.STORAGE_KEY_PREFIX
  let bannerStore: BannerStore

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.removeItem(STORAGE_KEY)

    bannerStore = new BannerStore()
  })

  afterEach(() => {
    if (bannerStore) {
      // Clean up store subscriptions
      bannerStore.store.set({ closedBanners: new Set() })
    }
  })

  function saveStorageData(closedBanners: BannerType[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(closedBanners))
  }

  describe("initialization", () => {
    it("initializes with empty closed banners when localStorage is empty", () => {
      bannerStore = new BannerStore()
      const state = get(bannerStore.store)

      expect(state.closedBanners.size).toBe(0)
    })

    it("initializes with closed banners from localStorage", () => {
      const closedBanners = [BannerType.APPS]
      saveStorageData(closedBanners)

      bannerStore = new BannerStore()
      const state = get(bannerStore.store)

      expect(state.closedBanners.has(BannerType.APPS)).toBe(true)
      expect(state.closedBanners.size).toBe(1)
    })
  })

  describe("closeBanner", () => {
    it("adds banner type to closed banners set", () => {
      bannerStore.closeBanner(BannerType.APPS)

      const state = get(bannerStore.store)
      expect(state.closedBanners.has(BannerType.APPS)).toBe(true)
    })

    it("persists closed banner to localStorage", () => {
      bannerStore.closeBanner(BannerType.APPS)

      expect(localStorage.getItem(STORAGE_KEY)).toEqual(
        JSON.stringify([BannerType.APPS])
      )
    })

    it("handles closing multiple different banners", () => {
      bannerStore.closeBanner(BannerType.APPS)

      const state = get(bannerStore.store)
      expect(state.closedBanners.size).toBe(1)
      expect(state.closedBanners.has(BannerType.APPS)).toBe(true)

      bannerStore.closeBanner(BannerType.AUTOMATIONS)
      expect(state.closedBanners.size).toBe(2)
      expect(state.closedBanners.has(BannerType.AUTOMATIONS)).toBe(true)
    })

    it("does not duplicate closed banners", () => {
      bannerStore.closeBanner(BannerType.APPS)
      bannerStore.closeBanner(BannerType.APPS)

      const state = get(bannerStore.store)
      expect(state.closedBanners.size).toBe(1)
    })
  })

  describe("shouldDisplayBanner", () => {
    it("returns true for banners that are not closed", () => {
      const shouldDisplay = bannerStore.shouldDisplayBanner(BannerType.APPS)
      const displayValue = get(shouldDisplay)

      expect(displayValue).toBe(true)
    })

    it("returns false for banners that are closed", () => {
      bannerStore.closeBanner(BannerType.APPS)

      const shouldDisplay = bannerStore.shouldDisplayBanner(BannerType.APPS)
      const displayValue = get(shouldDisplay)

      expect(displayValue).toBe(false)
    })

    it("returns a reactive store that updates when banner is closed", () => {
      const shouldDisplay = bannerStore.shouldDisplayBanner(BannerType.APPS)

      expect(get(shouldDisplay)).toBe(true)

      bannerStore.closeBanner(BannerType.APPS)

      expect(get(shouldDisplay)).toBe(false)
    })

    it("handles multiple banner types independently", () => {
      const appsDisplay = bannerStore.shouldDisplayBanner(BannerType.APPS)

      // Close one banner type
      bannerStore.closeBanner(BannerType.AUTOMATIONS)

      expect(get(appsDisplay)).toBe(true)
    })
  })
})
