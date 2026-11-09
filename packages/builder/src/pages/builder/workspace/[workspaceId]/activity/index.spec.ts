import { render } from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import ActivityIndex from "./index.svelte"

const mocks = vi.hoisted(() => {
  const { writable } = require("svelte/store")
  return {
    redirect: vi.fn(),
    featureFlags: writable({}),
  }
})

vi.mock("@roxi/routify", () => ({
  redirect: {
    subscribe: (run: (value: typeof mocks.redirect) => void) => {
      run(mocks.redirect)
      return () => {}
    },
  },
}))

vi.mock("@/stores/portal", () => ({
  featureFlags: mocks.featureFlags,
}))

describe("Activity index", () => {
  beforeEach(() => {
    mocks.redirect.mockReset()
  })

  it.each([
    { AI_AGENT_ACTIVITY: false, PLATFORM_ACTIONS: false, expected: "../home" },
    {
      AI_AGENT_ACTIVITY: true,
      PLATFORM_ACTIONS: false,
      expected: "./requests",
    },
    { AI_AGENT_ACTIVITY: false, PLATFORM_ACTIONS: true, expected: "./actions" },
    { AI_AGENT_ACTIVITY: true, PLATFORM_ACTIONS: true, expected: "./requests" },
  ])(
    "AI_AGENT_ACTIVITY=$AI_AGENT_ACTIVITY, PLATFORM_ACTIONS=$PLATFORM_ACTIONS redirects to $expected",
    ({ expected, ...flags }) => {
      mocks.featureFlags.set(flags)

      render(ActivityIndex)

      expect(mocks.redirect).toHaveBeenCalledWith(expected)
    }
  )
})
