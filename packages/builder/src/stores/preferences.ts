import { get } from "svelte/store"
import { API } from "@/api"
import { BudiStore } from "./BudiStore"
import type { ScreenLayoutType } from "@budibase/types"

interface UserPreferencesState {
  defaultLayout: ScreenLayoutType
  savingDefaultLayout: boolean
}

const DEFAULT_LAYOUT: ScreenLayoutType = "grid"

class UserPreferencesStore extends BudiStore<UserPreferencesState> {
  constructor() {
    super({
      defaultLayout: DEFAULT_LAYOUT,
      savingDefaultLayout: false,
    })
  }

  syncDefaultLayout(layout?: ScreenLayoutType) {
    this.set({
      defaultLayout: layout ?? DEFAULT_LAYOUT,
      savingDefaultLayout: false,
    })
  }

  async updateDefaultLayout(layout: ScreenLayoutType) {
    const previousLayout = get(this.store).defaultLayout
    if (previousLayout === layout) {
      return
    }

    this.update(state => ({
      ...state,
      defaultLayout: layout,
      savingDefaultLayout: true,
    }))

    try {
      await API.updateSelf({ defaultLayout: layout })
    } catch (error) {
      this.update(state => ({
        ...state,
        defaultLayout: previousLayout,
      }))
      throw error
    } finally {
      this.update(state => ({
        ...state,
        savingDefaultLayout: false,
      }))
    }
  }
}

export const DEFAULT_SCREEN_LAYOUT: ScreenLayoutType = DEFAULT_LAYOUT
export const userPreferences = new UserPreferencesStore()

export const getDefaultLayoutPreference = (): ScreenLayoutType => {
  return get(userPreferences.store).defaultLayout || DEFAULT_LAYOUT
}
