import { Duration } from "./Duration"
import env from "../environment"

export function getSessionExpirySeconds() {
  return env.SESSION_EXPIRY_SECONDS
    ? parseInt(env.SESSION_EXPIRY_SECONDS)
    : Duration.fromDays(7).toSeconds()
}

export function getSessionExpiryDate() {
  return new Date(Date.now() + getSessionExpirySeconds() * 1000)
}
