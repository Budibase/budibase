import { IdentityContext, IdentityType } from "@budibase/types"
import { defaultFlags, fetch, get, Flags, init } from "../"
import { context } from "../.."
import { setEnv, withEnv } from "../../environment"
import nodeFetch from "node-fetch"
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
      flags: "tenant1:_TEST_BOOLEAN",
      expected: { _TEST_BOOLEAN: true },
    },
    {
      tenant: "tenant1",
      flags: "tenant1:!_TEST_BOOLEAN",
      expected: { _TEST_BOOLEAN: false },
    },
    {
      tenant: "tenant1",
      flags: "*:_TEST_BOOLEAN",
      expected: { _TEST_BOOLEAN: true },
    },
    {
      tenant: "tenant1",
      flags: "tenant2:_TEST_BOOLEAN",
      expected: { _TEST_BOOLEAN: false },
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
      flags: "tenant1:_TEST_BOOLEAN,tenant1:FOO",
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

  describe("posthog", () => {
    const identity: IdentityContext = {
      _id: "us_1234",
      tenantId: "budibase",
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
          _TEST_BOOLEAN: true,
        },
      })

      await context.doInIdentityContext(identity, async () => {
        const flags = await fetch()
        expect(flags._TEST_BOOLEAN).toBe(true)
      })
    })

    it("should be able to read flags from posthog with payloads", async () => {
      mockFlags({
        featureFlags: {
          _TEST_STRING: true,
        },
        featureFlagPayloads: {
          _TEST_STRING: "test payload",
        },
      })

      await context.doInIdentityContext(identity, async () => {
        const flags = await fetch()
        expect(flags._TEST_STRING).toBe("test payload")
      })
    })

    it("should be able to read flags from posthog with numbers", async () => {
      mockFlags({
        featureFlags: {
          _TEST_NUMBER: true,
        },
        featureFlagPayloads: {
          _TEST_NUMBER: 123,
        },
      })

      await context.doInIdentityContext(identity, async () => {
        const flags = await fetch()
        expect(flags._TEST_NUMBER).toBe(123)
      })
    })
  })
})
