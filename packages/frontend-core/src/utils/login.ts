import * as Constants from "../constants"
import * as CookieUtils from "./cookies"

const SESSIONS_INVALIDATED_KEY = "bb-sessions-invalidated"
const SESSIONS_MAX_KEY = "bb-sessions-max"

export function redirectToLoginWithReturnUrl(returnUrl?: string) {
  const resolvedReturnUrl =
    returnUrl ??
    `${window.location.pathname}${window.location.search}${window.location.hash}`
  CookieUtils.setCookie(Constants.Cookies.ReturnUrl, resolvedReturnUrl)
  window.location.href = "/builder/auth/login"
}

export function popNumSessionsInvalidated(): {
  invalidated: number
  maxSessions: number | undefined
} {
  const invalidated = parseInt(
    localStorage.getItem(SESSIONS_INVALIDATED_KEY) || "0",
    10
  )
  const raw = localStorage.getItem(SESSIONS_MAX_KEY)
  const maxSessions = raw !== null ? parseInt(raw, 10) : undefined
  localStorage.removeItem(SESSIONS_INVALIDATED_KEY)
  localStorage.removeItem(SESSIONS_MAX_KEY)
  return { invalidated, maxSessions }
}

export function pushNumSessionsInvalidated(
  num: number,
  maxSessions?: number
) {
  const currentCount = parseInt(
    localStorage.getItem(SESSIONS_INVALIDATED_KEY) || "0",
    10
  )
  localStorage.setItem(
    SESSIONS_INVALIDATED_KEY,
    (currentCount + num).toString()
  )
  if (maxSessions !== undefined) {
    localStorage.setItem(SESSIONS_MAX_KEY, maxSessions.toString())
  }
}

export function invalidationMessage(
  num: number,
  maxSessions: number | undefined
) {
  const sessionText = num === 1 ? "session" : "sessions"
  const limitText =
    maxSessions !== undefined ? maxSessions : "a limited number of"
  return `You've been logged out of ${num} other ${sessionText} because users are only allowed ${limitText} active sessions at any one time.`
}
