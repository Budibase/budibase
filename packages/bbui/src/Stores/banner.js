import { writable } from "svelte/store"

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
      type: "negative",
      extraButtonText: "View Status",
      extraButtonAction: () => window.open("https://status.budibase.com/"),
    }

    await show(config)
  }

  const queue = async entries => {
    banner.update(store => {
      const sorted = [...store.messages, ...entries].sort(
        (a, b) => a.priority > b.priority
      )
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
