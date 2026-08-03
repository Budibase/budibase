import { describe, expect, it } from "vitest"
import { canAccessFunctions, isFunctionClientGateOpen } from "./availability"

describe("Function availability", () => {
  it.each([
    { featureEnabled: true, cloud: false, expected: true },
    { featureEnabled: true, cloud: true, expected: false },
    { featureEnabled: false, cloud: false, expected: false },
    { featureEnabled: false, cloud: true, expected: false },
  ])(
    "gates the client for feature=$featureEnabled cloud=$cloud",
    ({ featureEnabled, cloud, expected }) => {
      expect(isFunctionClientGateOpen({ featureEnabled, cloud })).toBe(expected)
    }
  )

  it.each([
    {
      featureEnabled: true,
      cloud: false,
      serverAvailable: true,
      expected: true,
    },
    {
      featureEnabled: true,
      cloud: false,
      serverAvailable: false,
      expected: false,
    },
    {
      featureEnabled: true,
      cloud: true,
      serverAvailable: true,
      expected: false,
    },
    {
      featureEnabled: true,
      cloud: true,
      serverAvailable: false,
      expected: false,
    },
    {
      featureEnabled: false,
      cloud: false,
      serverAvailable: true,
      expected: false,
    },
    {
      featureEnabled: false,
      cloud: false,
      serverAvailable: false,
      expected: false,
    },
    {
      featureEnabled: false,
      cloud: true,
      serverAvailable: true,
      expected: false,
    },
    {
      featureEnabled: false,
      cloud: true,
      serverAvailable: false,
      expected: false,
    },
  ])(
    "requires all gates for feature=$featureEnabled cloud=$cloud server=$serverAvailable",
    ({ featureEnabled, cloud, serverAvailable, expected }) => {
      expect(
        canAccessFunctions({ featureEnabled, cloud, serverAvailable })
      ).toBe(expected)
    }
  )
})
