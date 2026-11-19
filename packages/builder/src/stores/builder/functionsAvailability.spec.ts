import { get } from "svelte/store"
import { describe, expect, it, vi } from "vitest"

const availability = vi.hoisted(() => ({
  cloud: false,
  enabled: true,
  action: true,
}))

vi.mock("../portal/admin", () => ({
  admin: {
    subscribe: (run: (value: { cloud: boolean }) => void) => {
      run({ cloud: availability.cloud })
      return () => {}
    },
  },
}))
vi.mock("../portal/featureFlags", () => ({
  featureFlags: {
    subscribe: (run: (value: { FUNCTIONS: boolean }) => void) => {
      run({ FUNCTIONS: availability.enabled })
      return () => {}
    },
  },
}))
vi.mock("./automations", () => ({
  automationStore: {
    subscribe: (run: (value: object) => void) => {
      run({
        blockDefinitions: {
          ACTION: availability.action ? { EXECUTE_FUNCTION: {} } : {},
        },
      })
      return () => {}
    },
  },
}))

import { functionsAvailable } from "./functionsAvailability"

describe("Function availability", () => {
  it.each([
    { cloud: false, enabled: true, action: true, expected: true },
    { cloud: true, enabled: true, action: true, expected: false },
    { cloud: false, enabled: false, action: true, expected: false },
    { cloud: false, enabled: true, action: false, expected: false },
  ])(
    "respects server availability and rollout: %j",
    ({ expected, ...state }) => {
      Object.assign(availability, state)
      expect(get(functionsAvailable)).toBe(expected)
    }
  )
})
