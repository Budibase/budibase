import {
  TenantFeatureFlag,
  buildFeatureFlags,
  getTenantFeatureFlags,
} from "../"
import env from "../../environment"

const { ONBOARDING_TOUR, LICENSING, USER_GROUPS } = TenantFeatureFlag

describe("featureFlags", () => {
  beforeEach(() => {
    env._set("TENANT_FEATURE_FLAGS", "")
  })

  it("Should return no flags when the TENANT_FEATURE_FLAG is empty", async () => {
    let features = buildFeatureFlags()
    expect(features).toBeUndefined()
  })

  it("Should generate a map of global and named tenant feature flags from the env value", async () => {
    env._set(
      "TENANT_FEATURE_FLAGS",
      `*:${ONBOARDING_TOUR},tenant1:!${ONBOARDING_TOUR},tenant2:${USER_GROUPS},tenant1:${LICENSING}`
    )

    const parsedFlags: Record<string, string[]> = {
      "*": [ONBOARDING_TOUR],
      tenant1: [`!${ONBOARDING_TOUR}`, LICENSING],
      tenant2: [USER_GROUPS],
    }

    let features = buildFeatureFlags()

    expect(features).toBeDefined()
    expect(features).toEqual(parsedFlags)
  })

  it("Should add feature flag flag only to explicitly configured tenant", async () => {
    env._set(
      "TENANT_FEATURE_FLAGS",
      `*:${LICENSING},*:${USER_GROUPS},tenant1:${ONBOARDING_TOUR}`
    )

    let tenant1Flags = getTenantFeatureFlags("tenant1")
    let tenant2Flags = getTenantFeatureFlags("tenant2")

    expect(tenant1Flags).toBeDefined()
    expect(tenant1Flags).toEqual([LICENSING, USER_GROUPS, ONBOARDING_TOUR])

    expect(tenant2Flags).toBeDefined()
    expect(tenant2Flags).toEqual([LICENSING, USER_GROUPS])
  })
})

it("Should exclude tenant1 from global feature flag", async () => {
  env._set(
    "TENANT_FEATURE_FLAGS",
    `*:${LICENSING},*:${ONBOARDING_TOUR},tenant1:!${ONBOARDING_TOUR}`
  )

  let tenant1Flags = getTenantFeatureFlags("tenant1")
  let tenant2Flags = getTenantFeatureFlags("tenant2")

  expect(tenant1Flags).toBeDefined()
  expect(tenant1Flags).toEqual([LICENSING])

  expect(tenant2Flags).toBeDefined()
  expect(tenant2Flags).toEqual([LICENSING, ONBOARDING_TOUR])
})

it("Should explicitly add flags to configured tenants only", async () => {
  env._set(
    "TENANT_FEATURE_FLAGS",
    `tenant1:${ONBOARDING_TOUR},tenant1:${LICENSING},tenant2:${LICENSING}`
  )

  let tenant1Flags = getTenantFeatureFlags("tenant1")
  let tenant2Flags = getTenantFeatureFlags("tenant2")

  expect(tenant1Flags).toBeDefined()
  expect(tenant1Flags).toEqual([ONBOARDING_TOUR, LICENSING])

  expect(tenant2Flags).toBeDefined()
  expect(tenant2Flags).toEqual([LICENSING])
})
