import { Duration } from "./Duration"
import env from "../environment"

export function getSessionExpirySeconds() {
  const DEFAULT = Duration.fromDays(7).toSeconds()
  if (!env.SESSION_EXPIRY_SECONDS) {
    return DEFAULT
  }
  const parsed = parseInt(env.SESSION_EXPIRY_SECONDS)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT
}

export function getSessionExpiryDate() {
  return new Date(Date.now() + getSessionExpirySeconds() * 1000)
}
