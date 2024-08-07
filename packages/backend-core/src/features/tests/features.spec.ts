import { IdentityContext, IdentityType } from "@budibase/types"
import { defaultFlags, fetch, get, Flags, init } from "../"
import { context } from "../.."
import { setEnv, withEnv } from "../../environment"
import nock from "nock"

describe("feature flags", () => {
  interface TestCase {
    tenant: string
    flags: string
    expected: Partial<Flags>
  }

  it.each<TestCase>([
    {
      tenant: "tenant1",
      flags: "tenant1:ONBOARDING_TOUR",
      expected: { ONBOARDING_TOUR: true },
    },
    {
      tenant: "tenant1",
      flags: "tenant1:!ONBOARDING_TOUR",
      expected: { ONBOARDING_TOUR: false },
    },
    {
      tenant: "tenant1",
      flags: "*:ONBOARDING_TOUR",
      expected: { ONBOARDING_TOUR: true },
    },
    {
      tenant: "tenant1",
      flags: "tenant2:ONBOARDING_TOUR",
      expected: { ONBOARDING_TOUR: false },
    },
    {
      tenant: "tenant1",
      flags: "",
      expected: defaultFlags(),
    },
  ])(
    'should find flags $expected for $tenant with string "$flags"',
    ({ tenant, flags, expected }) =>
      context.doInTenant(tenant, async () =>
        withEnv({ TENANT_FEATURE_FLAGS: flags }, async () => {
          const flags = await fetch()
          expect(flags).toMatchObject(expected)

          for (const [key, expectedValue] of Object.entries(expected)) {
            const value = await get(key as keyof Flags)
            expect(value).toBe(expectedValue)
          }
        })
      )
  )

  interface FailedTestCase {
    tenant: string
    flags: string
    expected: string | RegExp
  }

  it.each<FailedTestCase>([
    {
      tenant: "tenant1",
      flags: "tenant1:ONBOARDING_TOUR,tenant1:FOO",
      expected: "Feature: FOO is not an allowed option",
    },
  ])(
    "should fail with message \"$expected\" for $tenant with string '$flags'",
    ({ tenant, flags, expected }) =>
      context.doInTenant(tenant, () =>
        withEnv({ TENANT_FEATURE_FLAGS: flags }, () =>
          expect(fetch()).rejects.toThrow(expected)
        )
      )
  )

  // describe("posthog", () => {
  //   const identity: IdentityContext = {
  //     _id: "us_1234",
  //     tenantId: "budibase",
  //     type: IdentityType.USER,
  //     email: "test@example.com",
  //     firstName: "Test",
  //     lastName: "User",
  //   }

  //   let cleanup: () => void

  //   beforeAll(() => {
  //     cleanup = setEnv({ POSTHOG_TOKEN: "test" })
  //     init()
  //   })

  //   afterAll(() => {
  //     cleanup()
  //   })

  //   beforeEach(() => {
  //     nock.cleanAll()
  //   })

  //   it("should be able to read flags from posthog", () =>
  //     context.doInIdentityContext(identity, async () => {
  //       nock("https://app.posthog.com")
  //         .get("/api/feature_flags/tenant/budibase")
  //         .reply(200, {
  //           flags: {
  //             "budibase:onboardingTour": true,
  //           },
  //         })

  //       const flags = await fetch()
  //       expect(flags.ONBOARDING_TOUR).toBe(true)
  //     }))
  // })
})
