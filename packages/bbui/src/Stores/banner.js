import { writable } from "svelte/store"

export const BANNER_TYPES = {
  NEUTRAL: "neutral",
  INFO: "info",
  NEGATIVE: "negative",
  WARNING: "warning",
}

export function createBannerStore() {
  const DEFAULT_CONFIG = {
    messages: [],
  }

  const banner = writable(DEFAULT_CONFIG)

  const show = async (
    // eslint-disable-next-line
    config = { message, type, extraButtonText, extraButtonAction, onChange }
  ) => {
    banner.update(store => {
      return {
        ...store,
        ...config,
      }
    })
  }

  const showStatus = async () => {
    const config = {
      message: "Some systems are experiencing issues",
      type: BANNER_TYPES.NEGATIVE,
      extraButtonText: "View Status",
      extraButtonAction: () => window.open("https://status.budibase.com/"),
    }

    await queue([config])
  }

  const queue = async entries => {
    const priority = {
      [BANNER_TYPES.NEGATIVE]: 0,
      [BANNER_TYPES.WARNING]: 1,
      [BANNER_TYPES.INFO]: 2,
    }
    banner.update(store => {
      const sorted = [...store.messages, ...entries].sort((a, b) => {
        if (priority[a.type] == priority[b.type]) {
          return 0
        }
        return priority[a.type] < priority[b.type] ? -1 : 1
      })
      return {
        ...store,
        messages: sorted,
      }
    })
  }

  return {
    subscribe: banner.subscribe,
    showStatus,
    show,
    queue,
  }
}

export const banner = createBannerStore()
