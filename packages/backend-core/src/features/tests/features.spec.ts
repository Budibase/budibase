import { IdentityContext, IdentityType } from "@budibase/types"
import { FlagSet, init, shutdown } from "../"
import * as context from "../../context"
import environment, { withEnv } from "../../environment"
import nodeFetch from "node-fetch"
import nock from "nock"
import * as crypto from "crypto"

const schema = {
  TEST_BOOLEAN: false,
  TEST_BOOLEAN_DEFAULT_TRUE: true,
}
const flags = new FlagSet(schema)

interface TestCase {
  it: string
  identity?: Partial<IdentityContext>
  environmentFlags?: string
  posthogFlags?: PostHogFlags
  expected?: Partial<typeof schema>
  errorMessage?: string | RegExp
}

interface PostHogFlags {
  featureFlags?: Record<string, boolean>
  featureFlagPayloads?: Record<string, string>
}

function mockPosthogFlags(
  flags: PostHogFlags,
  opts?: { token?: string; distinct_id?: string }
) {
  const { token = "test", distinct_id = "us_1234" } = opts || {}
  nock("https://us.i.posthog.com")
    .post("/decide/?v=3", body => {
      return body.token === token && body.distinct_id === distinct_id
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
      it: "should not error on unrecognised PostHog flag",
      posthogFlags: {
        featureFlags: { UNDEFINED: true },
      },
      expected: flags.defaults(),
    },
    {
      it: "should be possible to override a default true flag to false",
      environmentFlags: "default:!TEST_BOOLEAN_DEFAULT_TRUE",
      expected: { TEST_BOOLEAN_DEFAULT_TRUE: false },
    },
  ])(
    "$it",
    async ({
      identity,
      environmentFlags,
      posthogFlags,
      expected,
      errorMessage,
    }) => {
      const env: Partial<typeof environment> = {
        TENANT_FEATURE_FLAGS: environmentFlags,
        SELF_HOSTED: false,
        POSTHOG_FEATURE_FLAGS_ENABLED: "true",
      }

      if (posthogFlags) {
        mockPosthogFlags(posthogFlags)
        env.POSTHOG_TOKEN = "test"
        env.POSTHOG_API_HOST = "https://us.i.posthog.com"
      }

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
            await expect(flags.fetch()).rejects.toThrow(errorMessage)
          } else if (expected) {
            const values = await flags.fetch()
            expect(values).toMatchObject(expected)

            for (const [key, expectedValue] of Object.entries(expected)) {
              const value = await flags.isEnabled(key as keyof typeof schema)
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

    // We need to pass in node-fetch here otherwise nock won't get used
    // because posthog-node uses axios under the hood.
    init({
      fetch: (url, opts) => {
        return nodeFetch(url, opts)
      },
    })

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

  it("should still get flags when user is logged out", async () => {
    const env: Partial<typeof environment> = {
      SELF_HOSTED: false,
      POSTHOG_FEATURE_FLAGS_ENABLED: "true",
      POSTHOG_API_HOST: "https://us.i.posthog.com",
      POSTHOG_TOKEN: "test",
    }

    const ip = "127.0.0.1"
    const hashedIp = crypto.createHash("sha512").update(ip).digest("hex")

    await withEnv(env, async () => {
      mockPosthogFlags(
        {
          featureFlags: { TEST_BOOLEAN: true },
        },
        {
          distinct_id: hashedIp,
        }
      )

      // We need to pass in node-fetch here otherwise nock won't get used
      // because posthog-node uses axios under the hood.
      init({
        fetch: (url, opts) => {
          return nodeFetch(url, opts)
        },
      })

      await context.doInIPContext(ip, async () => {
        await context.doInTenant("default", async () => {
          const result = await flags.fetch()
          expect(result.TEST_BOOLEAN).toBe(true)
        })
      })

      shutdown()
    })
  })
})
