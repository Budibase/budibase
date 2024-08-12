import { IdentityContext, IdentityType } from "@budibase/types"
import { Flag, FlagSet, FlagValues, init } from "../"
import { context } from "../.."
import { setEnv, withEnv } from "../../environment"
import nodeFetch from "node-fetch"
import nock from "nock"

const schema = {
  TEST_BOOLEAN: Flag.boolean(false),
  TEST_STRING: Flag.string("default value"),
  TEST_NUMBER: Flag.number(0),
}
const flags = new FlagSet(schema)

describe("feature flags", () => {
  interface TestCase {
    tenant: string
    flags: string
    expected: Partial<FlagValues<typeof schema>>
  }

  it.each<TestCase>([
    {
      tenant: "tenant1",
      flags: "tenant1:TEST_BOOLEAN",
      expected: { TEST_BOOLEAN: true },
    },
    {
      tenant: "tenant1",
      flags: "tenant1:!TEST_BOOLEAN",
      expected: { TEST_BOOLEAN: false },
    },
    {
      tenant: "tenant1",
      flags: "*:TEST_BOOLEAN",
      expected: { TEST_BOOLEAN: true },
    },
    {
      tenant: "tenant1",
      flags: "tenant2:TEST_BOOLEAN",
      expected: { TEST_BOOLEAN: false },
    },
    {
      tenant: "tenant1",
      flags: "",
      expected: flags.defaults(),
    },
  ])(
    'should find flags $expected for $tenant with string "$flags"',
    ({ tenant, flags: envFlags, expected }) =>
      context.doInTenant(tenant, async () =>
        withEnv({ TENANT_FEATURE_FLAGS: envFlags }, async () => {
          const values = await flags.fetch()
          expect(values).toMatchObject(expected)

          for (const [key, expectedValue] of Object.entries(expected)) {
            const value = await flags.get(key as keyof typeof schema)
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
      flags: "tenant1:TEST_BOOLEAN,tenant1:FOO",
      expected: "Feature: FOO is not an allowed option",
    },
  ])(
    "should fail with message \"$expected\" for $tenant with string '$flags'",
    ({ tenant, flags: envFlags, expected }) =>
      context.doInTenant(tenant, () =>
        withEnv({ TENANT_FEATURE_FLAGS: envFlags }, () =>
          expect(flags.fetch()).rejects.toThrow(expected)
        )
      )
  )

  describe("posthog", () => {
    const identity: IdentityContext = {
      _id: "us_1234",
      tenantId: "tenant1",
      type: IdentityType.USER,
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
    }

    let cleanup: () => void

    beforeAll(() => {
      cleanup = setEnv({ POSTHOG_TOKEN: "test" })
    })

    afterAll(() => {
      cleanup()
    })

    beforeEach(() => {
      nock.cleanAll()

      // We need to pass in node-fetch here otherwise nock won't get used
      // because posthog-node uses axios under the hood.
      init({ fetch: nodeFetch })
    })

    function mockFlags(flags: {
      featureFlags?: Record<string, boolean>
      featureFlagPayloads?: Record<string, any>
    }) {
      nock("https://us.i.posthog.com")
        .post("/decide/?v=3", body => {
          return body.token === "test" && body.distinct_id === "us_1234"
        })
        .reply(200, flags)
    }

    it("should be able to read flags from posthog", async () => {
      mockFlags({
        featureFlags: {
          TEST_BOOLEAN: true,
        },
      })

      await context.doInIdentityContext(identity, async () => {
        const values = await flags.fetch()
        expect(values.TEST_BOOLEAN).toBe(true)
      })
    })

    it("should be able to read flags from posthog with payloads", async () => {
      mockFlags({
        featureFlags: {
          TEST_STRING: true,
        },
        featureFlagPayloads: {
          TEST_STRING: "test payload",
        },
      })

      await context.doInIdentityContext(identity, async () => {
        const values = await flags.fetch()
        expect(values.TEST_STRING).toBe("test payload")
      })
    })

    it("should be able to read flags from posthog with numbers", async () => {
      mockFlags({
        featureFlags: {
          TEST_NUMBER: true,
        },
        featureFlagPayloads: {
          TEST_NUMBER: 123,
        },
      })

      await context.doInIdentityContext(identity, async () => {
        const values = await flags.fetch()
        expect(values.TEST_NUMBER).toBe(123)
      })
    })

    it("should not fail when a flag is not known", async () => {
      mockFlags({
        featureFlags: {
          _SOME_RANDOM_FLAG: true,
        },
      })

      await context.doInIdentityContext(identity, async () => {
        await expect(flags.fetch()).resolves.not.toThrow()
      })
    })

    it("should not override flags set in the environment", async () => {
      mockFlags({
        featureFlags: {
          TEST_BOOLEAN: false,
        },
      })

      await withEnv(
        { TENANT_FEATURE_FLAGS: `${identity.tenantId}:TEST_BOOLEAN` },
        async () => {
          await context.doInIdentityContext(identity, async () => {
            const values = await flags.fetch()
            expect(values.TEST_BOOLEAN).toBe(true)
          })
        }
      )
    })

    it("should not override flags set in the environment with a ! prefix", async () => {
      mockFlags({
        featureFlags: {
          TEST_BOOLEAN: true,
        },
      })

      await withEnv(
        { TENANT_FEATURE_FLAGS: `${identity.tenantId}:!TEST_BOOLEAN` },
        async () => {
          await context.doInIdentityContext(identity, async () => {
            const values = await flags.fetch()
            expect(values.TEST_BOOLEAN).toBe(false)
          })
        }
      )
    })
  })
})
