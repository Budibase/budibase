import { IdentityContext, IdentityType } from "@budibase/types"
import { FlagSet, init, shutdown } from "../"
import * as context from "../../context"
import environment, { withEnv } from "../../environment"
import nodeFetch from "node-fetch"
import nock from "nock"

const schema = {
  TEST_BOOLEAN: false,
  TEST_BOOLEAN_DEFAULT_TRUE: true,
}
const flags = new FlagSet(schema)

interface TestCase {
  it: string
  identity?: Partial<IdentityContext>
  environmentFlags?: string
  posthogFlags?: Record<string, boolean>
  expected?: Partial<typeof schema>
  errorMessage?: string | RegExp
}

interface Property {
  key: string
  value: string
  operator: string
  type: string
}

interface Group {
  properties: Property[]
  rollout_percentage: number
  variant: string | null
}

interface Filters {
  groups: Group[]
}

interface FlagRules {
  active: boolean
  deleted: boolean
  ensure_experience_continuity: boolean
  filters: Filters
  has_encrypted_payloads: boolean
  id: string
  key: string
  name: string
  team_id: number
  version: number
}

interface LocalEvaluationResponse {
  flags: FlagRules[]
}

function posthogFlags(flags: Record<string, boolean>): LocalEvaluationResponse {
  return {
    flags: Object.entries(flags).map(([name, value]) => ({
      active: value,
      deleted: false,
      ensure_experience_continuity: false,
      filters: {
        groups: [
          {
            properties: [],
            rollout_percentage: 100,
            variant: null,
          },
        ],
      },
      version: 2,
      has_encrypted_payloads: false,
      id: name,
      name,
      team_id: 1,
      key: name,
    })),
  }
}

function mockPosthogFlags(flags: Record<string, boolean>) {
  nock("https://us.i.posthog.com")
    .get("/api/feature_flag/local_evaluation?token=test&send_cohorts")
    .reply(200, posthogFlags(flags))
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
      posthogFlags: { TEST_BOOLEAN: true },
      expected: { TEST_BOOLEAN: true },
    },
    {
      it: "should not be able to override a negative environment flag from PostHog",
      environmentFlags: "default:!TEST_BOOLEAN",
      posthogFlags: { TEST_BOOLEAN: true },
      expected: { TEST_BOOLEAN: false },
    },
    {
      it: "should not be able to override a positive environment flag from PostHog",
      environmentFlags: "default:TEST_BOOLEAN",
      posthogFlags: {
        TEST_BOOLEAN: false,
      },
      expected: { TEST_BOOLEAN: true },
    },
    {
      it: "should not error on unrecognised PostHog flag",
      posthogFlags: {
        UNDEFINED: true,
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
          // Required for local evaluation rule polling to start
          personalApiKey: "test",
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

        try {
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
        } finally {
          shutdown()
        }
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
      // Required for local evaluation rule polling to start
      personalApiKey: "test",
      fetch: (url, opts) => {
        return nodeFetch(url, opts)
      },
    })

    nock("https://us.i.posthog.com")
      .get("/api/feature_flag/local_evaluation?token=test&send_cohorts")
      .reply(503)
      .persist()

    try {
      await withEnv(
        { POSTHOG_TOKEN: "test", POSTHOG_API_HOST: "https://us.i.posthog.com" },
        async () => {
          await context.doInIdentityContext(identity, async () => {
            await flags.fetch()
          })
        }
      )
    } finally {
      shutdown()
    }
  })

  it("should still get flags when user is logged out", async () => {
    const env: Partial<typeof environment> = {
      SELF_HOSTED: false,
      POSTHOG_FEATURE_FLAGS_ENABLED: "true",
      POSTHOG_API_HOST: "https://us.i.posthog.com",
      POSTHOG_TOKEN: "test",
    }

    const ip = "127.0.0.1"

    await withEnv(env, async () => {
      mockPosthogFlags({ TEST_BOOLEAN: true })

      // We need to pass in node-fetch here otherwise nock won't get used
      // because posthog-node uses axios under the hood.
      init({
        // Required for local evaluation rule polling to start
        personalApiKey: "test",
        fetch: (url, opts) => {
          return nodeFetch(url, opts)
        },
      })

      try {
        await context.doInIPContext(ip, async () => {
          await context.doInTenant("default", async () => {
            const result = await flags.fetch()
            expect(result.TEST_BOOLEAN).toBe(true)
          })
        })
      } finally {
        shutdown()
      }
    })
  })
})
