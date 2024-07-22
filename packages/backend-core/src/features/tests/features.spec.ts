import { defaultFlags, fetch, get, Flags } from "../"
import { context } from "../.."
import env from "../../environment"

async function withFlags<T>(flags: string, f: () => T): Promise<T> {
  const oldFlags = env.TENANT_FEATURE_FLAGS
  env._set("TENANT_FEATURE_FLAGS", flags)
  try {
    return await f()
  } finally {
    env._set("TENANT_FEATURE_FLAGS", oldFlags)
  }
}

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
      context.doInTenant(tenant, () =>
        withFlags(flags, async () => {
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
    async ({ tenant, flags, expected }) => {
      context.doInTenant(tenant, () =>
        withFlags(flags, async () => {
          await expect(fetch()).rejects.toThrow(expected)
        })
      )
    }
  )
})
