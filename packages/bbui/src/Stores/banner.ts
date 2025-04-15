import { writable } from "svelte/store"

export const BANNER_TYPES = {
  NEUTRAL: "neutral",
  INFO: "info",
  NEGATIVE: "negative",
  WARNING: "warning",
}

interface BannerConfig {
  message?: string
  type?: string
  extraButtonText?: string
  extraButtonAction?: () => void
  onChange?: () => void
}

interface DefaultConfig {
  messages: BannerConfig[]
}

export function createBannerStore() {
  const DEFAULT_CONFIG: DefaultConfig = {
    messages: [],
  }

  const banner = writable<DefaultConfig>(DEFAULT_CONFIG)

  const show = async (config: BannerConfig = {}) => {
    banner.update(store => {
      return {
        ...store,
        ...config,
      }
    })
  }

  const showStatus = async () => {
    const config: BannerConfig = {
      message: "Some systems are experiencing issues",
      type: BANNER_TYPES.NEGATIVE,
      extraButtonText: "View Status",
      extraButtonAction: () => window.open("https://status.budibase.com/"),
    }

    await queue([config])
  }

  const queue = async (entries: Array<BannerConfig>) => {
    const priority: Record<string, number> = {
      [BANNER_TYPES.NEGATIVE]: 0,
      [BANNER_TYPES.WARNING]: 1,
      [BANNER_TYPES.INFO]: 2,
    }
    banner.update(store => {
      const sorted = [...store.messages, ...entries].sort((a, b) => {
        if (
          priority[a.type as keyof typeof priority] ===
          priority[b.type as keyof typeof priority]
        ) {
          return 0
        }
        return priority[a.type as keyof typeof priority] <
          priority[b.type as keyof typeof priority]
          ? -1
          : 1
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
