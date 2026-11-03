import { IdentityContext, IdentityType } from "@budibase/types"
import { FlagSet, init, reload, shutdown } from "../"
import * as context from "../../context"
import environment, { withEnv } from "../../environment"
import nodeFetch from "node-fetch"
import nock from "nock"
import cluster from "node:cluster"

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

  it("can resolve trusted flags without request overrides", async () => {
    await withEnv(
      { TENANT_FEATURE_FLAGS: "default:TEST_BOOLEAN" },
      async () => {
        await context.doInTenant("default", async () => {
          await context.doInFeatureFlagOverrideContext(
            { TEST_BOOLEAN: false },
            async () => {
              expect(await flags.isEnabled("TEST_BOOLEAN")).toBe(false)
              expect(
                await flags.isEnabled("TEST_BOOLEAN", {
                  includeOverrides: false,
                })
              ).toBe(true)
            }
          )
        })
      }
    )
  })

  it("re-evaluates cached flags when overrides change", async () => {
    await context.doInTenant("default", async () => {
      await context.doInFeatureFlagOverrideContext(
        { TEST_BOOLEAN: false },
        async () => {
          expect(await flags.isEnabled("TEST_BOOLEAN")).toBe(false)

          await context.doInFeatureFlagOverrideContext(
            { TEST_BOOLEAN: true },
            async () => {
              expect(await flags.isEnabled("TEST_BOOLEAN")).toBe(true)
            }
          )
        }
      )
    })
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

describe("manual feature flag reload", () => {
  const reloadError = {
    status: 503,
    message: "Unable to reload feature flags",
  }
  const cloudEnvironment = {
    SELF_HOSTED: false,
    TENANT_FEATURE_FLAGS: "",
    POSTHOG_FEATURE_FLAGS_ENABLED: "true",
    POSTHOG_API_HOST: "https://example.com",
    POSTHOG_TOKEN: "test-project-token",
    POSTHOG_PERSONAL_TOKEN: "test-personal-token",
    POSTHOG_FEATURE_FLAGS_POLLING_INTERVAL_MS: undefined,
  }
  const identity: IdentityContext = {
    _id: "us_reload",
    tenantId: "default",
    type: IdentityType.USER,
    email: "reload@example.com",
  }
  const response = ({
    status = 200,
    body = posthogFlags({ TEST_BOOLEAN: true }),
  }: { status?: number; body?: unknown } = {}) => ({
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  })
  const readFlag = () =>
    context.doInIdentityContext(identity, async () => {
      return (await flags.fetch()).TEST_BOOLEAN
    })
  const finishStartup = () =>
    new Promise<void>(resolve => setImmediate(resolve))

  afterEach(() => {
    shutdown()
    jest.restoreAllMocks()
  })

  it("refreshes evaluated flags while retaining the daily polling interval", async () => {
    await withEnv(cloudEnvironment, async () => {
      const fetch = jest.fn(async () =>
        response({ body: posthogFlags({ TEST_BOOLEAN: false }) })
      )
      const timeout = jest.spyOn(globalThis, "setTimeout")
      init({ fetch })
      await finishStartup()
      fetch.mockResolvedValueOnce(response())

      await reload()

      expect(await readFlag()).toBe(true)
      expect(timeout).toHaveBeenCalledWith(expect.any(Function), 86400000)
    })
  })

  it("coalesces simultaneous manual refreshes into one download", async () => {
    await withEnv(cloudEnvironment, async () => {
      const fetch = jest.fn(async () => response())
      init({ fetch })
      await finishStartup()
      fetch.mockClear()

      await Promise.all([reload(), reload(), reload()])

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(await readFlag()).toBe(true)
    })
  })

  it.each([
    { name: "an HTTP failure", status: 503, body: "test-personal-token" },
    { name: "missing definitions", status: 200, body: {} },
    { name: "invalid definitions", status: 200, body: { flags: null } },
    { name: "invalid flag entries", status: 200, body: { flags: [null] } },
  ])(
    "keeps loaded flags after $name and returns a generic failure",
    async testCase => {
      await withEnv(cloudEnvironment, async () => {
        const fetch = jest.fn(async () => response())
        init({ fetch })
        await finishStartup()
        fetch.mockResolvedValueOnce(response(testCase))

        await expect(reload()).rejects.toMatchObject(reloadError)

        expect(await readFlag()).toBe(true)
      })
    }
  )

  it("keeps loaded flags on a network failure without exposing credentials", async () => {
    await withEnv(cloudEnvironment, async () => {
      const fetch = jest.fn(async () => response())
      init({ fetch })
      await finishStartup()
      fetch.mockRejectedValueOnce(new Error("test-personal-token"))

      await expect(reload()).rejects.toMatchObject(reloadError)

      expect(await readFlag()).toBe(true)
    })
  })

  it("does not mistake an in-flight startup download for a successful reload", async () => {
    await withEnv(cloudEnvironment, async () => {
      let finishInitialDownload: (
        value: ReturnType<typeof response>
      ) => void = () => {
        throw new Error("Startup download has not begun")
      }
      const fetch = jest.fn(async () => response({ status: 503 }))
      fetch.mockImplementationOnce(
        () => new Promise(resolve => (finishInitialDownload = resolve))
      )
      init({ fetch })
      const refresh = reload()
      finishInitialDownload(response())

      await expect(refresh).rejects.toMatchObject(reloadError)
    })
  })

  it("can retry after a failed manual reload", async () => {
    await withEnv(cloudEnvironment, async () => {
      const fetch = jest.fn(async () => response())
      init({ fetch })
      await finishStartup()
      fetch.mockResolvedValueOnce(response({ status: 503 }))
      await expect(reload()).rejects.toMatchObject(reloadError)

      await reload()

      expect(await readFlag()).toBe(true)
      expect(fetch).toHaveBeenCalledTimes(3)
    })
  })

  it.each([
    { name: "disabled", overrides: { POSTHOG_FEATURE_FLAGS_ENABLED: "" } },
    { name: "self hosted", overrides: { SELF_HOSTED: true } },
    {
      name: "missing a personal key",
      overrides: { POSTHOG_PERSONAL_TOKEN: "" },
    },
  ])("rejects reload when PostHog is $name", async ({ overrides }) => {
    await withEnv({ ...cloudEnvironment, ...overrides }, async () => {
      init({ fetch: jest.fn(async () => response()) })

      await expect(reload()).rejects.toMatchObject(reloadError)
    })
  })

  it("uses the effective personal key supplied through initialization options", async () => {
    await withEnv(
      { ...cloudEnvironment, POSTHOG_PERSONAL_TOKEN: "" },
      async () => {
        init({
          personalApiKey: "test-options-key",
          fetch: jest.fn(async () => response()),
        })
        await finishStartup()

        await expect(reload()).resolves.toBeUndefined()
      }
    )
  })

  it("rejects a clustered application worker", async () => {
    jest.replaceProperty(cluster, "isWorker", true)

    await expect(reload()).rejects.toMatchObject({ status: 409 })
  })
})
