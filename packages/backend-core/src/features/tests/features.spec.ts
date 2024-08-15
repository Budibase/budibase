import { IdentityContext, IdentityType, UserCtx } from "@budibase/types"
import { Flag, FlagSet, FlagValues, init, shutdown } from "../"
import * as context from "../../context"
import environment, { withEnv } from "../../environment"
import nodeFetch from "node-fetch"
import nock from "nock"

const schema = {
  TEST_BOOLEAN: Flag.boolean(false),
  TEST_STRING: Flag.string("default value"),
  TEST_NUMBER: Flag.number(0),
}
const flags = new FlagSet(schema)

interface TestCase {
  it: string
  identity?: Partial<IdentityContext>
  environmentFlags?: string
  posthogFlags?: PostHogFlags
  licenseFlags?: Array<string>
  expected?: Partial<FlagValues<typeof schema>>
  errorMessage?: string | RegExp
}

interface PostHogFlags {
  featureFlags?: Record<string, boolean>
  featureFlagPayloads?: Record<string, string>
}

function mockPosthogFlags(flags: PostHogFlags) {
  nock("https://us.i.posthog.com")
    .post("/decide/?v=3", body => {
      return body.token === "test" && body.distinct_id === "us_1234"
    })
    .reply(200, flags)
    .persist()
}

describe("feature flags", () => {
  beforeEach(() => {
    nock.cleanAll()
  })

  it.each<TestCase>([
    {
      it: "should should find a simple boolean flag in the environment",
      environmentFlags: "default:TEST_BOOLEAN",
      expected: { TEST_BOOLEAN: true },
    },
    {
      it: "should should find a simple netgative boolean flag in the environment",
      environmentFlags: "default:!TEST_BOOLEAN",
      expected: { TEST_BOOLEAN: false },
    },
    {
      it: "should should match stars in the environment",
      environmentFlags: "*:TEST_BOOLEAN",
      expected: { TEST_BOOLEAN: true },
    },
    {
      it: "should not match a different tenant's flags",
      environmentFlags: "otherTenant:TEST_BOOLEAN",
      expected: { TEST_BOOLEAN: false },
    },
    {
      it: "should return the defaults when no flags are set",
      expected: flags.defaults(),
    },
    {
      it: "should ignore unknown feature flags",
      environmentFlags: "default:TEST_BOOLEAN,default:FOO",
      expected: { TEST_BOOLEAN: true },
    },
    {
      it: "should be able to read boolean flags from PostHog",
      posthogFlags: {
        featureFlags: { TEST_BOOLEAN: true },
      },
      expected: { TEST_BOOLEAN: true },
    },
    {
      it: "should be able to read string flags from PostHog",
      posthogFlags: {
        featureFlags: { TEST_STRING: true },
        featureFlagPayloads: { TEST_STRING: "test" },
      },
      expected: { TEST_STRING: "test" },
    },
    {
      it: "should be able to read numeric flags from PostHog",
      posthogFlags: {
        featureFlags: { TEST_NUMBER: true },
        featureFlagPayloads: { TEST_NUMBER: "123" },
      },
      expected: { TEST_NUMBER: 123 },
    },
    {
      it: "should not be able to override a negative environment flag from PostHog",
      environmentFlags: "default:!TEST_BOOLEAN",
      posthogFlags: {
        featureFlags: { TEST_BOOLEAN: true },
      },
      expected: { TEST_BOOLEAN: false },
    },
    {
      it: "should not be able to override a positive environment flag from PostHog",
      environmentFlags: "default:TEST_BOOLEAN",
      posthogFlags: {
        featureFlags: {
          TEST_BOOLEAN: false,
        },
      },
      expected: { TEST_BOOLEAN: true },
    },
    {
      it: "should be able to set boolean flags through the license",
      licenseFlags: ["TEST_BOOLEAN"],
      expected: { TEST_BOOLEAN: true },
    },
    {
      it: "should not be able to override a negative environment flag from license",
      environmentFlags: "default:!TEST_BOOLEAN",
      licenseFlags: ["TEST_BOOLEAN"],
      expected: { TEST_BOOLEAN: false },
    },
    {
      it: "should not error on unrecognised PostHog flag",
      posthogFlags: {
        featureFlags: { UNDEFINED: true },
      },
      expected: flags.defaults(),
    },
    {
      it: "should not error on unrecognised license flag",
      licenseFlags: ["UNDEFINED"],
      expected: flags.defaults(),
    },
  ])(
    "$it",
    async ({
      identity,
      environmentFlags,
      posthogFlags,
      licenseFlags,
      expected,
      errorMessage,
    }) => {
      const env: Partial<typeof environment> = {
        TENANT_FEATURE_FLAGS: environmentFlags,
      }

      if (posthogFlags) {
        mockPosthogFlags(posthogFlags)
        env.POSTHOG_TOKEN = "test"
        env.POSTHOG_API_HOST = "https://us.i.posthog.com"
        env.POSTHOG_PERSONAL_TOKEN = "test"
      }

      const ctx = { user: { license: { features: licenseFlags || [] } } }

      await withEnv(env, async () => {
        // We need to pass in node-fetch here otherwise nock won't get used
        // because posthog-node uses axios under the hood.
        init({
          fetch: (url, opts) => {
            return nodeFetch(url, opts)
          },
        })

        const fullIdentity: IdentityContext = {
          _id: "us_1234",
          tenantId: "default",
          type: IdentityType.USER,
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
          ...identity,
        }

        await context.doInIdentityContext(fullIdentity, async () => {
          if (errorMessage) {
            await expect(flags.fetch(ctx as UserCtx)).rejects.toThrow(
              errorMessage
            )
          } else if (expected) {
            const values = await flags.fetch(ctx as UserCtx)
            expect(values).toMatchObject(expected)

            for (const [key, expectedValue] of Object.entries(expected)) {
              const value = await flags.get(
                key as keyof typeof schema,
                ctx as UserCtx
              )
              expect(value).toBe(expectedValue)
            }
          } else {
            throw new Error("No expected value")
          }
        })

        shutdown()
      })
    }
  )

  it("should not error if PostHog is down", async () => {
    const identity: IdentityContext = {
      _id: "us_1234",
      tenantId: "default",
      type: IdentityType.USER,
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
    }

    nock("https://us.i.posthog.com")
      .post("/decide/?v=3", body => {
        return body.token === "test" && body.distinct_id === "us_1234"
      })
      .reply(503)
      .persist()

    await withEnv(
      { POSTHOG_TOKEN: "test", POSTHOG_API_HOST: "https://us.i.posthog.com" },
      async () => {
        await context.doInIdentityContext(identity, async () => {
          await flags.fetch()
        })
      }
    )
  })
})
