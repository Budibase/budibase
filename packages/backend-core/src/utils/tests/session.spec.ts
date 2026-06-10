import { getSessionExpirySeconds } from "../session"
import env from "../../environment"

const SEVEN_DAYS = 7 * 24 * 60 * 60

describe("getSessionExpirySeconds", () => {
  afterEach(() => {
    env._set("SESSION_EXPIRY_SECONDS", undefined)
  })

  it("returns 7 days when SESSION_EXPIRY_SECONDS is not set", () => {
    expect(getSessionExpirySeconds()).toBe(SEVEN_DAYS)
  })

  it("returns the configured value when SESSION_EXPIRY_SECONDS is a valid positive integer", () => {
    env._set("SESSION_EXPIRY_SECONDS", "3600")
    expect(getSessionExpirySeconds()).toBe(3600)
  })

  it("falls back to 7 days when SESSION_EXPIRY_SECONDS is a non-numeric string", () => {
    env._set("SESSION_EXPIRY_SECONDS", "abc")
    expect(getSessionExpirySeconds()).toBe(SEVEN_DAYS)
  })

  it("falls back to 7 days when SESSION_EXPIRY_SECONDS is zero", () => {
    env._set("SESSION_EXPIRY_SECONDS", "0")
    expect(getSessionExpirySeconds()).toBe(SEVEN_DAYS)
  })

  it("falls back to 7 days when SESSION_EXPIRY_SECONDS is negative", () => {
    env._set("SESSION_EXPIRY_SECONDS", "-300")
    expect(getSessionExpirySeconds()).toBe(SEVEN_DAYS)
  })
})
