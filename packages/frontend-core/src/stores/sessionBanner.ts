import { writable } from "svelte/store"

interface SessionBannerAction {
  label: string
  onClick: () => void
}

interface SessionBanner {
  text: string
  variant?: "session-not-authenticated"
  background?: string
  textColor?: string
  textSize?: number
  action?: SessionBannerAction
}

export const sessionBannerStore = writable<SessionBanner | null>(null)
